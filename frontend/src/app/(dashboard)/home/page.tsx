"use client";

import NewAnnouncement from "@/components/dashboard/home/NewAnnouncement";

import { Skeleton } from "@/components/ui/skeleton";
import { useAnnouncements } from "@/lib/dashboard/announcements";
import { useEffect } from "react";

export default function Home() {
  const list = [1, 2, 3, 4, 5];
  const { data, error, isLoading } = useAnnouncements();

  return (
    <main className="min-h-screen w-full p-4 pt-20 flex flex-col">
      <div className="flex flex-row justify-between items-center pb-4">
        <h1 className="text-left w-full">Announcements</h1>
        <NewAnnouncement />
      </div>
      {error || isLoading ? (
        <ul className="flex flex-col gap-4">
          {list.map((element) => {
            return (
              <li
                key={element}
                className="flex flex-row items-center space-x-4 "
              >
                <Skeleton className="h-12 w-12 min-w-12 rounded-full" />
                <div className="flex flex-col w-full space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[90%]" />
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <ul className="flex flex-col gap-4">
          {data!.docs.map((element) => {
            return (
              <li
                key={element.title}
                className="flex flex-col justify-center items-start"
              >
                <h1>{element.title}</h1>
                <h2>{element.content.toString()}</h2>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
