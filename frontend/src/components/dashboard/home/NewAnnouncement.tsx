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
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import {
  Announcement,
  AnnouncementPayload,
  AnnouncementResponse,
  announcementsUrl,
} from "@/lib/dashboard/announcements";
import { useRef, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import LexicalEditor from "../LexicalEditor";
import { LexicalEditor as LE } from "lexical";
import { useMutateCollection } from "@/lib/hooks";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  title: z.string().max(50, {
    message: "Title must be at most 50 characters.",
  }),
});

export interface NewAnnouncementProps {
  editPayload?: {
    id: string;
    content: string;
    title: string;
  };
}

export default function NewAnnouncement({ editPayload }: NewAnnouncementProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: editPayload?.title,
    },
  });

  const editorRef: any = useRef<LE | undefined>();
  const { trigger: createTrigger, isMutating: createIsMutating } =
    useMutateCollection<
      Announcement,
      AnnouncementResponse,
      AnnouncementPayload
    >(
      announcementsUrl,
      "POST",
      undefined,
      (result, currentData) => {
        return { docs: [...currentData!.docs, result] };
        // return currentData!;
      },
      (data) => data
    );
  const { trigger: updateTrigger, isMutating: updateIsMutating } =
    useMutateCollection<
      Announcement,
      AnnouncementResponse,
      AnnouncementPayload
    >(
      announcementsUrl,
      "PATCH",
      editPayload?.id,
      (result, currentData) => {
        return { docs: [...currentData!.docs, result] };
      },
      (data) => data
    );
  const [open, setOpen] = useState(false);
  const auth = useAuth();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(JSON.stringify(editorRef.current!.getEditorState()));

    try {
      if (editPayload) {
        const result = await updateTrigger({
          token: auth.token!,
          payload: {
            title: values.title,
            content: JSON.stringify(editorRef.current.getEditorState()),
          },
        });
        console.log(result);
      } else {
        const result = await createTrigger({
          token: auth.token!,
          payload: {
            title: values.title,
            content: JSON.stringify(editorRef.current.getEditorState()),
          },
        });
        console.log(result);
      }

      toast({
        title: "Success",
        variant: "constructive",
        description: `${editPayload ? "Edited" : "Created"} announcement`,
        duration: 1000,
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        variant: "destructive",
        description: `Could not ${
          editPayload ? "edit" : "create"
        } announcement`,
        duration: 1000,
      });
    }
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
          <SheetTitle>{editPayload ? "Edit" : "New"} announcement</SheetTitle>
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
            <div className="flex flex-col gap-3">
              <FormLabel htmlFor="content">Content</FormLabel>
              <LexicalEditor
                ref={editorRef}
                editorState={editPayload?.content}
              />
            </div>
            <SheetFooter>
              {/* TODO: Add loader */}
              <Button
                disabled={createIsMutating || updateIsMutating}
                type="submit"
              >
                Submit
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
