"use client";

import NewAnnouncement from "@/components/dashboard/home/NewAnnouncement";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const list = [1, 2, 3, 4, 5];

  return (
    <main className="min-h-screen w-full p-4 pt-20 flex flex-col">
      <div className="flex flex-row justify-between items-center pb-4">
        <h1 className="text-left w-full">Announcements</h1>
        <NewAnnouncement />
      </div>
      <ul className="flex flex-col  gap-4">
        {list.map((element) => {
          return (
            <li key={element} className="flex flex-row items-center space-x-4 ">
              <Skeleton className="h-12 w-12 min-w-12 rounded-full" />
              <div className="flex flex-col w-full space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
