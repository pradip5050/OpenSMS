"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import LogoImage from "@/components/auth/Logo";
import { useLogo } from "@/lib/login/logo";
import { Toaster } from "@/components/ui/toaster";

export default function Login() {
  const { data, error, isLoading } = useLogo();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <LoginForm />
        <div className="hidden bg-muted lg:block">
          <LogoImage data={data} error={error} isLoading={isLoading} />
        </div>
      </div>
      <Toaster />
    </main>
  );
}
