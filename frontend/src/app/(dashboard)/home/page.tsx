"use client";

import AnnouncementSheet from "@/components/dashboard/home/AnnouncementSheet";

import { Skeleton } from "@/components/ui/skeleton";
import {
  AnnouncementResponse,
  announcementsUrl,
  deleteAnnouncements,
  getFormattedDatetime,
} from "@/lib/dashboard/announcements";

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
import { isFacultyOrAdmin } from "@/lib/rbac";
import { Trash2 } from "lucide-react";
import { useFetchCollection } from "@/lib/hooks";
import { PiCross, PiXBold } from "react-icons/pi";

export default function Home() {
  const { user, token } = useAuth();
  const { data, error, isLoading, mutate } =
    useFetchCollection<AnnouncementResponse>(announcementsUrl, token, {
      draft: false,
      depth: 2,
    });
  // TODO: Sort data during fetch
  const dataWithDate = data?.docs
    ?.map((announcement) => {
      return {
        ...announcement,
        createdAt: new Date(announcement.createdAt),
        updatedAt: new Date(announcement.updatedAt),
      };
    })
    .toSorted((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1));

  async function deleteAnnouncementById(id: string) {
    const { result, error } = await deleteAnnouncements(
      announcementsUrl,
      token,
      id
    );

    // TODO: Handle popups
    console.log(result);
    console.log(error);
    mutate();
  }

  return (
    <main className="min-h-screen w-full p-4 pt-20 flex flex-col max-h-screen">
      <div className="flex flex-row justify-between items-center pb-4">
        <h1 className="text-left w-full">Announcements</h1>
        {isFacultyOrAdmin(user!.roles) && <AnnouncementSheet />}
      </div>
      {isLoading ? (
        <Table>
          <TableBody>
            {Array.from({ length: 5 }, (_, index) => {
              return (
                <TableRow
                  key={index}
                  className="flex flex-row items-center space-x-4 "
                >
                  <TableCell className="flex flex-col w-full space-y-2">
                    <Skeleton className="h-8 w-[70%]" />
                    <Skeleton className="h-8 w-[95%]" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : error ? (
        <div className="flex flex-col gap-2 h-[calc(100vh-18rem)] items-center justify-center">
          <PiXBold size="3rem" className="text-destructive" />
          <h2 className="text-2xl md:text-3xl text-center">
            Failed to load announcements
          </h2>
        </div>
      ) : (
        <Table>
          <TableBody>
            {dataWithDate!.length === 0 ? (
              <div className="flex h-[calc(100vh-18rem)] items-center justify-center">
                <h1 className="text-2xl md:text-3xl text-center">
                  No announcements yet
                </h1>
              </div>
            ) : (
              dataWithDate!.map((element) => {
                const updatedAt = getFormattedDatetime(element.updatedAt);
                return (
                  <TableRow
                    key={element.id}
                    className="flex flex-row items-center justify-between"
                  >
                    <TableCell>
                      <div className="font-medium text-3xl">
                        {element.title}
                      </div>
                      <div className="text-lg text-muted-foreground md:inline">
                        {`${updatedAt.date} | ${updatedAt.hours}:${updatedAt.minutes}`}
                      </div>
                    </TableCell>
                    <TableCell className="flex justify-end h-full items-center gap-2">
                      {isFacultyOrAdmin(user!.roles) && (
                        <Button
                          // TODO: Show warning dialog
                          onClick={() => deleteAnnouncementById(element.id)}
                          variant={"destructive"}
                          size={"icon"}
                        >
                          <Trash2 />
                        </Button>
                      )}
                      {/* FIXME: Sheet open & openChanged cause stale content, make a list of open instead */}
                      <Sheet>
                        <SheetTrigger>
                          <Button>Open</Button>
                        </SheetTrigger>
                        <SheetContent
                          className="overflow-y-auto h-[80%] max-h-[80%]"
                          side={"bottom"}
                        >
                          <SheetHeader className="flex flex-row justify-between">
                            <SheetTitle>{element.title}</SheetTitle>
                            {isFacultyOrAdmin(user!.roles) && (
                              <AnnouncementSheet
                                // mutate={mutate}
                                editPayload={{
                                  content: element.content,
                                  id: element.id,
                                  title: element.title,
                                }}
                              />
                            )}
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
              })
            )}
          </TableBody>
        </Table>
      )}
    </main>
  );
}
