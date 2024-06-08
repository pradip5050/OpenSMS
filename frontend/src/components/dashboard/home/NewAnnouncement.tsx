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
import { useCreateAnnouncements } from "@/lib/dashboard/announcements";
import { useRef, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import LexicalEditor from "../LexicalEditor";

const formSchema = z.object({
  title: z.string().max(50, {
    message: "Title must be at most 50 characters.",
  }),
});

export default function NewAnnouncement() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { trigger, isMutating } = useCreateAnnouncements();
  const [open, setOpen] = useState(false);
  const auth = useAuth();

  // FIXME: Page reloads on submit and request is not executed
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(JSON.stringify(editorRef.current.getEditorState()));

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
    setOpen(false);
  }

  const editorRef: any = useRef();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Button variant={"secondary"}>New</Button>
      </SheetTrigger>
      <SheetContent side={"bottom"}>
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
              <LexicalEditor ref={editorRef} />
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
