"use client";

import { useAuth } from "@/components/AuthProvider";
import { isStudent } from "@/lib/rbac";
import React from "react";

export default function ParallelLayout({
  student,
  faculty,
}: {
  student: React.ReactNode;
  faculty: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <main className="min-h-screen w-full p-4 pt-20 flex flex-col max-h-screen">
      <div className="flex flex-row justify-between items-center pb-4">
        <h1 className="text-left w-full">Progress</h1>
      </div>
      {isStudent(user!.roles) ? student : faculty}
    </main>
  );
}
