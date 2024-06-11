import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValue,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import {
  AnnouncementResponse,
  useCreateAnnouncements,
} from "@/lib/dashboard/announcements";
import { useRef, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import LexicalEditor from "../LexicalEditor";
import { KeyedMutator } from "swr";
import { LexicalEditor as LE } from "lexical";

const formSchema = z.object({
  title: z.string().max(50, {
    message: "Title must be at most 50 characters.",
  }),
});

export interface NewAnnouncementProps {
  mutate: KeyedMutator<AnnouncementResponse>;
  editPayload?: {
    id: string;
    content: string;
    title: string;
  };
}

export default function NewAnnouncement({
  mutate,
  editPayload,
}: NewAnnouncementProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: editPayload?.title,
    },
  });

  const editorRef: any = useRef<LE | undefined>();
  const { trigger, isMutating } = useCreateAnnouncements();
  const [open, setOpen] = useState(false);
  const auth = useAuth();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(JSON.stringify(editorRef.current!.getEditorState()));

    try {
      const result = await trigger({
        token: auth.token!,
        payload: {
          title: values.title,
          content: JSON.stringify(editorRef.current.getEditorState()),
        },
      });
      console.log(result);
    } catch (err) {
      console.log(err);
    }
    // TODO: Handle error
    mutate();
    setOpen(false);
  }

  async function editAnnouncement(id: string) {
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Button variant={"secondary"}>{editPayload ? "Edit" : "New"}</Button>
      </SheetTrigger>
      <SheetContent side={"bottom"} className="max-h-[80%]">
        <SheetHeader>
          <SheetTitle>New announcement</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="pt-8 space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="title">Title</FormLabel>
                  <FormControl>
                    <Input {...field} id="title" type="text" required></Input>
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            {/* <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="content">Content</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      draggable={false}
                      id="content"
                      required
                    ></Textarea>
                  </FormControl>
                </FormItem>
              )}
            ></FormField> */}
            <div className="flex flex-col gap-3">
              <FormLabel htmlFor="content">Content</FormLabel>
              <LexicalEditor
                ref={editorRef}
                editorState={editPayload?.content}
              />
            </div>
            <SheetFooter>
              {/* TODO: Add loader */}
              <Button disabled={isMutating} type="submit">
                Submit
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
