"use client";

import { Button } from "@/components/ui/button";
import "./globals.css";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "@/components/ThemeProvider";

// TODO: Implement when https://github.com/vercel/next.js/discussions/50034 is fixed

export default function NotFound() {
  const router = useRouter();

  return (
    <ThemeProvider>
      <div className="h-screen w-screen flex flex-col gap-5 items-center justify-center bg-background text-foreground">
        <h1 className="text-5xl">404 Not Found</h1>
        <Button onClick={() => router.push("/home")}>Return Home</Button>
      </div>
    </ThemeProvider>
  );
}
