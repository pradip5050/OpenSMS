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

  // TODO: Use RBAC util function
  return <>{isStudent(user!.roles) ? student : faculty}</>;
}
