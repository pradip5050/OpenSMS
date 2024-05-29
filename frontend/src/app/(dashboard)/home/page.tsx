"use client";

import NewAnnouncement from "@/components/dashboard/home/NewAnnouncement";

import { Skeleton } from "@/components/ui/skeleton";
import { useAnnouncements } from "@/lib/dashboard/announcements";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/components/AuthProvider";

export default function Home() {
  const list = [1, 2, 3, 4, 5];
  const { data, error, isLoading } = useAnnouncements();
  const { roles } = useAuth();
  console.log(["admin", "faculty"].includes(roles!));

  return (
    <main className="min-h-screen w-full p-4 pt-20 flex flex-col max-h-screen">
      <div className="flex flex-row justify-between items-center pb-4">
        <h1 className="text-left w-full">Announcements</h1>
        {/* TODO: Move RBAC utility functions to another file */}
        {["admin", "faculty"].includes(roles!) && <NewAnnouncement />}
      </div>
      {/* TODO: Handle error */}
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
        <Table>
          <TableBody>
            {data!.docs.map((element) => {
              return (
                <TableRow
                  key={element.id}
                  className="flex flex-row items-center justify-between"
                >
                  <TableCell>
                    <div className="font-medium text-3xl">{element.title}</div>
                    <div className="text-lg text-muted-foreground md:inline">
                      Description
                    </div>
                  </TableCell>
                  <TableCell className="flex justify-end h-full items-center">
                    <Sheet>
                      <SheetTrigger>
                        <Button>Open</Button>
                      </SheetTrigger>
                      <SheetContent
                        className="overflow-y-scroll h-[80%] max-h-[80%]"
                        side={"bottom"}
                      >
                        <SheetHeader>
                          <SheetTitle>{element.title}</SheetTitle>
                        </SheetHeader>
                        <div
                          className="pt-8 lexical"
                          dangerouslySetInnerHTML={{
                            __html: element.contentHtml,
                          }}
                        ></div>
                      </SheetContent>
                    </Sheet>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </main>
  );
}
