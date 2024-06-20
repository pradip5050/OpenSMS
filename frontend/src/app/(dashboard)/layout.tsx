"use client";

import { Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthProvider } from "@/components/AuthProvider";
import Template from "./template";
import { Menu } from "lucide-react";
import Navbar from "@/components/dashboard/Navbar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import UserProfile from "@/components/dashboard/UserProfile";
import { useState } from "react";
import { useMetadata } from "@/lib/login/metadata";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useMetadata();

  return (
    <html lang="en">
      <head>
        <title>{data?.title ?? "OpenSMS"}</title>
        <meta name="description" content="Student Management System" />
        <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
      </head>
      <body className={`${inter.className} flex flex-row min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <header className="h-16 absolute w-full flex justify-between p-3 border border-b-1">
              <div className="flex items-center justify-center gap-4">
                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0 md:hidden"
                    >
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="flex flex-col">
                    <div className="py-16">
                      <Navbar setOpen={setOpen} />
                    </div>
                  </SheetContent>
                </Sheet>
                {isLoading ? (
                  <Skeleton className="w-32 h-5" />
                ) : (
                  <h1 className="flex text-xl items-center justify-center">
                    {data?.title ?? "OpenSMS"}
                  </h1>
                )}
              </div>
              <div className="flex gap-2">
                <ThemeToggle />
                <UserProfile />
              </div>
            </header>
            <aside className="hidden md:flex flex-col min-w-56 max-w-56 w-56 mt-16 border border-t-0 py-2">
              <Navbar setOpen={setOpen} />
            </aside>
            <Template key="dashboard">{children}</Template>
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
