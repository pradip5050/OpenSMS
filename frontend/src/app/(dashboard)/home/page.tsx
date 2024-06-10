"use client";

import NewAnnouncement from "@/components/dashboard/home/NewAnnouncement";

import { Skeleton } from "@/components/ui/skeleton";
import {
  announcementsUrl,
  deleteAnnouncements,
  mapAnnouncements,
  useAnnouncements,
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
import { Delete, Trash2 } from "lucide-react";

export default function Home() {
  const list = [1, 2, 3, 4, 5];
  const { user, token } = useAuth();
  const { data, error, isLoading, mutate } = useAnnouncements(token);

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
        {isFacultyOrAdmin(user!.roles) && <NewAnnouncement mutate={mutate} />}
      </div>
      {/* TODO: Handle error & move Table/TableBody up */}
      {isLoading ? (
        <Table>
          <TableBody>
            {list.map((element) => {
              return (
                <TableRow
                  key={element}
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
        <>
          <h1>ERROR</h1>
          <p>{JSON.stringify(error)}</p>
        </>
      ) : (
        <Table>
          <TableBody>
            {data!.docs.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <h1 className="text-3xl">No announcements yet!</h1>
              </div>
            ) : (
              data!.docs.map((el) => {
                const element = mapAnnouncements(el);
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
                        {element.createdAt}
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
              })
            )}
          </TableBody>
        </Table>
      )}
    </main>
  );
}
