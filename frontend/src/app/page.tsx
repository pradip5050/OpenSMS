"use client";

import { LoginForm } from "@/components/LoginForm";
import { Logo, mapLogo, placeholderUrl, useLogo } from "@/lib/login";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

function logoImage(data: Logo | undefined, error: any, isLoading: boolean) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100"
          height="100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("animate-spin", "")} // Add additional classes in ""
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </div>
    );
  } else if (error) {
    return (
      <Image
        src={placeholderUrl}
        alt="Image"
        width="1920"
        height="1080"
        className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      />
    );
  }
  return (
    <Image
      src={mapLogo(data!).logo.url}
      alt="Image"
      width="1920"
      height="1080"
      className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
    />
  );
}

export default function Login() {
  const { data, error, isLoading } = useLogo();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <LoginForm />
        <div className="hidden bg-muted lg:block">
          {logoImage(data, error, isLoading)}
        </div>
      </div>
    </main>
  );
}
