"use client";

import { useAuth } from "@/components/AuthProvider";
import AnnouncementSheet from "@/components/dashboard/home/AnnouncementSheet";
import { isFacultyOrAdmin } from "@/lib/rbac";
import React from "react";

export default function ChildLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <main className="min-h-screen w-full p-4 pt-20 flex flex-col max-h-screen">
      <div className="flex flex-row justify-between items-center pb-4">
        <h1 className="text-left w-full">Announcements</h1>
        {isFacultyOrAdmin(user!.roles) && <AnnouncementSheet />}
      </div>
      {children}
    </main>
  );
}
