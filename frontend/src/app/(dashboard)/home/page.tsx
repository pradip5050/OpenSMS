"use client";

import AnnouncementSheet from "@/components/dashboard/home/AnnouncementSheet";

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
import { useFetchCollection } from "@/lib/hooks";
import GenericError from "@/components/GenericError";
import DeleteAlertDialog from "@/components/DeleteAlertDialog";
import Spinner from "@/components/Spinner";

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

  const isAuthorized = isFacultyOrAdmin(user!.roles);

  if (isLoading) {
    return <Spinner variant="page" />;
  }

  if (!!error) {
    return <GenericError variant="error" />;
  }

  if (dataWithDate!.length === 0) {
    return (
      <GenericError
        variant="noData"
        title="No announcements yet"
        showDesc={!isAuthorized}
        showRefreshButton={!isAuthorized}
      />
    );
  }

  return (
    <Table>
      <TableBody>
        {dataWithDate!.map((element) => {
          const updatedAt = getFormattedDatetime(element.updatedAt);
          return (
            <TableRow
              key={element.id}
              className="flex flex-row items-center justify-between"
            >
              <TableCell>
                <div className="font-medium text-3xl">{element.title}</div>
                <div className="text-lg text-muted-foreground md:inline">
                  {`${updatedAt.date} | ${updatedAt.hours}:${updatedAt.minutes}`}
                </div>
              </TableCell>
              <TableCell className="flex justify-end h-full items-center gap-2">
                {isAuthorized && (
                  <DeleteAlertDialog
                    onClick={() => deleteAnnouncementById(element.id)}
                    // TODO: Add ismutating when implemented
                    variant={{ type: "icon", disabled: false }}
                  />
                )}
                {/* FIXME: Sheet open & openChanged cause stale content, make a list of open instead */}
                <Sheet>
                  <SheetTrigger>
                    <Button variant="secondary">Open</Button>
                  </SheetTrigger>
                  <SheetContent
                    className="overflow-y-auto h-[80%] max-h-[80%]"
                    side={"bottom"}
                  >
                    <SheetHeader className="flex flex-row justify-between">
                      <SheetTitle>{element.title}</SheetTitle>
                      {isFacultyOrAdmin(user!.roles) && (
                        <AnnouncementSheet
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
        })}
      </TableBody>
    </Table>
  );
}
