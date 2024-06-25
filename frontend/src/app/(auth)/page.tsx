"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import LogoImage from "@/components/auth/Logo";
import { Toaster } from "@/components/ui/toaster";

export default function Login() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <LoginForm />
        <div className="hidden bg-muted lg:block max-h-screen">
          <LogoImage />
        </div>
      </div>
      <Toaster />
    </main>
  );
}
