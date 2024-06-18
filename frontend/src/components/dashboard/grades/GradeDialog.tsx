import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFetchCollection } from "@/lib/hooks";
import { facultiesUrl, FacultyResponse } from "@/lib/dashboard/faculties";
import { useAuth } from "@/components/AuthProvider";

export interface GradeDialogProps {
  student?: string;
  course?: string;
}

const formSchema = z.object({
  student: z.string(),
  course: z.string(),
  testType: z.number(),
  marks: z.number(),
  maxMarks: z.number(),
});

export function GradeDialog({ student, course }: GradeDialogProps) {
  const isEdit = !!student && !!course;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      maxMarks: 100,
      student: student,
      course: course,
    },
  });
  const { user, token } = useAuth();

  //  TODO: Move to parent
  const {
    data: facultyData,
    isLoading: facultyIsLoading,
    error: facultyError,
  } = useFetchCollection<FacultyResponse>(facultiesUrl, token, {
    depth: 2,
    draft: false,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit" : "Add"} grade</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* TODO: Add comboboxes for student, course */}
          {/* Courses should be limited to those taught by faculty */}
          <FormField
            control={form.control}
            name="testType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Test Type</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="marks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marks</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxMarks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Marks</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </DialogContent>
  );
}
