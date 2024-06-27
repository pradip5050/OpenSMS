import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutateCollection } from "@/lib/hooks";
import { useAuth } from "@/components/AuthProvider";
import {
  Grade,
  GradePayload,
  GradeResponse,
  gradesUrl,
} from "@/lib/dashboard/grades";
import { Course } from "@/lib/dashboard/courses";
import { Student } from "@/lib/dashboard/students";
import { Combobox } from "../Combobox";

export interface GradeDialogProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  student?: string;
  course?: string;
  id?: string;
  marks?: number;
  maxMarks?: number;
  testType?: string;
  facultyCourses?: Course[];
  facultyCourseStudents?: Student[];
}

const formSchema = z.object({
  student: z.string(),
  course: z.string(),
  testType: z.string(),
  marks: z.string(),
  maxMarks: z.string(),
});

export function GradeDialog({
  student,
  course,
  id,
  marks,
  maxMarks,
  testType,
  facultyCourses,
  setOpen,
}: GradeDialogProps) {
  const isEdit = !facultyCourses;

  const courseOptions = facultyCourses?.map((val) => {
    return { value: val.id, label: val.name };
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      maxMarks: maxMarks?.toString() ?? "100",
      marks: marks?.toString(),
      testType: testType,
      student: student,
      course: course ?? "",
    },
  });
  const { user, token } = useAuth();
  const [courseValue, setCourseValue] = useState("");

  const {
    trigger: gradeUpdateTrigger,
    isMutating: gradeUpdateIsMutating,
    error: gradeUpdateError,
  } = useMutateCollection<Grade, GradeResponse, GradePayload>(
    gradesUrl,
    "PATCH",
    (result, data) => {
      // TODO:
      const grade = (result as any as { doc: Grade }).doc;
      return {
        docs: [...data!.docs!.filter((val) => grade.id !== val.id), grade],
      };
    }
  );
  const {
    trigger: gradeCreateTrigger,
    isMutating: gradeCreateIsMutating,
    error: gradeCreateError,
  } = useMutateCollection<Grade, GradeResponse, GradePayload>(
    gradesUrl,
    "POST",
    (result, data) => {
      // TODO:
      const grade = (result as any as { doc: Grade }).doc;
      return {
        docs: [...data!.docs!, grade],
      };
    }
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isEdit) {
      await gradeUpdateTrigger({
        token: token!,
        id: id,
        payload: {
          ...values,
          marks: Number(values.marks),
          maxMarks: Number(values.maxMarks),
          course: { relationTo: "courses", value: values.course },
          student: { relationTo: "students", value: values.student },
        },
      });
      setOpen(false);
    } else {
      if (courseValue == "") {
        return;
      }
      await gradeCreateTrigger({
        token: token!,
        payload: {
          ...values,
          marks: Number(values.marks),
          maxMarks: Number(values.maxMarks),
          course: { relationTo: "courses", value: courseValue },
          student: { relationTo: "students", value: values.student },
        },
      });

      if (gradeCreateError) {
        console.log(gradeCreateError);
      }
      setOpen(false);
    }
  }

  const isMutating = gradeUpdateIsMutating || gradeCreateIsMutating;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit" : "Add"} grade</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          {!isEdit && (
            <Combobox
              options={courseOptions!}
              label="course"
              state={{ value: courseValue, setValue: setCourseValue }}
            />
          )}
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
          <Button disabled={isMutating} type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
}
