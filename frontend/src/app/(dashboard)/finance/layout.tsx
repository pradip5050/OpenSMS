"use client";

import { useAuth } from "@/components/AuthProvider";
import React from "react";

export default function ParallelLayout({
  student,
  faculty,
}: {
  student: React.ReactNode;
  faculty: React.ReactNode;
}) {
  const { user } = useAuth();

  return <>{user!.roles === "student" ? student : faculty}</>;
}
