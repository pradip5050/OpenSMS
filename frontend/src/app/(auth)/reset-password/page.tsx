"use client";

import LogoImage from "@/components/auth/Logo";
import { useMetadata } from "@/lib/login/metadata";
import { Toaster } from "@/components/ui/toaster";

export default function ResetPassword() {
  const { data, error, isLoading } = useMetadata();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        {/* <ForgotPasswordForm /> */}
        <div className="hidden bg-muted lg:block">
          <LogoImage data={data} error={error} isLoading={isLoading} />
        </div>
      </div>
      <Toaster />
    </main>
  );
}
