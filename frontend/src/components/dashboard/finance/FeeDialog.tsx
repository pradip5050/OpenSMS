"use client";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Student } from "@/lib/dashboard/user-profile";
import { Fee, FeePayload, FeeResponse, feesUrl } from "@/lib/dashboard/finance";
import { useAuth } from "@/components/AuthProvider";
import Spinner from "@/components/Spinner";
import { useMutateCollection } from "@/lib/hooks";

export interface AddFeeDialogProps {
  student?: Student;
  id?: string;
  description?: string;
  amount?: number;
  dueDate?: Date;
  paymentStatus?: "paid" | "unpaid" | "delayed";
}

const formSchema = z.object({
  description: z.string(),
  amount: z.string(), // FIXME: Convert to number
  dueDate: z.date(),
  paymentStatus: z.string(),
});

export function FeeDialog({
  student,
  id,
  description,
  amount,
  dueDate,
  paymentStatus,
}: AddFeeDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentStatus: paymentStatus ?? "unpaid",
      amount: amount?.toString(),
      description,
      dueDate,
    },
  });

  const {
    trigger: createFeeTrigger,
    isMutating: createFeeIsMutating,
    error: createFeeError,
  } = useMutateCollection<{ doc: Fee }, FeeResponse, FeePayload>(
    feesUrl,
    "POST",
    (result, data) => {
      return {
        docs: [...data!.docs!, result.doc],
      };
    }
  );
  const {
    trigger: updateFeeTrigger,
    isMutating: updateFeeIsMutating,
    error: updateFeeError,
  } = useMutateCollection<{ doc: Fee }, FeeResponse, FeePayload>(
    // TODO: Create interface for update/post responses
    feesUrl,
    "PATCH",
    (result, data) => {
      return {
        docs: [
          ...data!.docs!.filter((val) => val.id !== result.doc.id),
          result.doc,
        ],
      };
    }
  );
  const { token } = useAuth();

  const isEdit = !!description && !!amount && !!dueDate && !!id;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isEdit) {
      try {
        await updateFeeTrigger({
          token: token!,
          id: id,
          payload: {
            description: values.description,
            amount: Number(values.amount),
            dueDate: values.dueDate.toISOString(),
            paymentStatus: values.paymentStatus,
            student: {
              relationTo: "students",
              value: student!.id,
            },
          },
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        await createFeeTrigger({
          token: token!,
          payload: {
            description: values.description,
            amount: Number(values.amount),
            dueDate: values.dueDate.toISOString(),
            paymentStatus: "unpaid",
            student: {
              relationTo: "students",
              value: student!.id,
            },
          },
        });
      } catch (err) {
        console.log(err);
      }
    }
    // TODO: Handle error
    // setOpen(false);
  }

  const isMutating = createFeeIsMutating || updateFeeIsMutating;

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add fee</DialogTitle>
        <DialogDescription>
          Add a new fee to the selected student
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="pb-3">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="pb-3">
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="grid gap-1 pt-2">
                <FormLabel>Due date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button disabled={isMutating} type="submit">
              {isMutating ? <Spinner size="12" /> : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
