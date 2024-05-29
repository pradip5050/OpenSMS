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
import { login, LoginPayload, useLogin } from "@/lib/login/login";
import Spinner from "../Spinner";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useAuthDispatch } from "../AuthProvider";
import { AxiosError } from "axios";

const formSchema = z.object({
  email: z.string().email({ message: "Enter valid email address" }),
  password: z.string(),
});

export function LoginForm() {
  const { trigger, isMutating } = useLogin();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const router = useRouter();
  const authDispatch = useAuthDispatch();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = {
      email: values.email,
      password: values.password,
    } satisfies LoginPayload;

    try {
      const result = await trigger(payload);

      // Use session management library
      login(result.token, result.user.roles, authDispatch);

      router.push("/home");
    } catch (err) {
      const { dismiss } = toast({
        variant: "destructive",
        title: "Error!",
        description: JSON.stringify(err),
      });

      setTimeout(() => {
        dismiss();
      }, 2000);
    }
  }

  return (
    <div className="flex items-center justify-center py-12">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto grid w-[350px] gap-6"
        >
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
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
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="password"
                        type="password"
                        required
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button disabled={isMutating} type="submit" className="w-full">
              {isMutating ? <Spinner size="24" /> : "Login"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
