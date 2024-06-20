"use client";

import { Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthProvider } from "@/components/AuthProvider";
import { useMetadata } from "@/lib/login/metadata";
import { Skeleton } from "@/components/ui/skeleton";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data, isLoading } = useMetadata();

  return (
    <html lang="en">
      <head>
        <title>{data?.title ?? "OpenSMS"}</title>
        <meta name="description" content="Student Management System" />
        <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="z-10 h-16 absolute w-full flex justify-between items-center p-4">
            {isLoading ? (
              <Skeleton className="w-32 h-5" />
            ) : (
              <h1 className="flex text-xl items-center justify-center">
                {data?.title ?? "OpenSMS"}
              </h1>
            )}
            <ThemeToggle />
          </header>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
