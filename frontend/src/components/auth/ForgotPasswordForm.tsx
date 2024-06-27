"use client";

import { Button } from "@/components/ui/button";
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
} from "@/components/ui/form";
import {
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  usersUrl,
} from "@/lib/login/login";
import Spinner from "../Spinner";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useMutateCollection } from "@/lib/hooks";
import { constructiveToast, destructiveToast } from "@/lib/utils";

const formSchema = z.object({
  email: z.string().email({ message: "Enter valid email address" }),
});

export function ForgotPasswordForm() {
  const { trigger, isMutating } = useMutateCollection<
    never,
    ForgotPasswordResponse,
    ForgotPasswordPayload
  >(usersUrl, "POST");
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = {
      email: values.email,
    } satisfies ForgotPasswordPayload;

    try {
      await trigger({ payload, id: "forgot-password" });
      constructiveToast(
        toast,
        "Success",
        "An email was sent to reset the password",
        5000
      )();
    } catch (err) {
      destructiveToast(
        toast,
        "Error",
        "Failed to send forgot password request"
      )();
    }
  }

  return (
    <div className="flex items-center justify-center py-12 px-4 md:px-0">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto grid w-[350px] gap-6"
        >
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Forgot Password</h1>
            <p className="text-balance text-muted-foreground"></p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="email"
                        type="email"
                        placeholder="abc@gmail.com"
                        required
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button disabled={isMutating} type="submit" className="w-full">
              {isMutating ? <Spinner variant="button" /> : "Submit"}
            </Button>
            <Button className="w-full" onClick={() => router.back()}>
              Go back
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
