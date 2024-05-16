"use client";

import { LoginForm } from "@/components/LoginForm";
import Image from "next/image";

export default function Login() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <LoginForm />
        <div className="hidden bg-muted lg:block">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/991px-Placeholder_view_vector.svg.png"
            alt="Image"
            width="1920"
            height="1080"
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </main>
  );
}
