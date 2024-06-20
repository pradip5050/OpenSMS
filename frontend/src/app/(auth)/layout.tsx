"use client";

import { Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthProvider } from "@/components/AuthProvider";
import { useMetadata } from "@/lib/login/metadata";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data } = useMetadata();

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
          <header className="h-16 absolute w-full flex justify-end p-4">
            <ThemeToggle />
          </header>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
