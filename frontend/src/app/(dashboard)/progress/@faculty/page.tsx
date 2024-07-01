"use client";

import { useAuth } from "@/components/AuthProvider";
import { DataTable } from "@/components/dashboard/DataTable";
import GenericError from "@/components/GenericError";
import SortButton from "@/components/SortButton";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Course } from "@/lib/dashboard/courses";
import { FacultyResponse, facultiesUrl } from "@/lib/dashboard/faculties";
import { useFetchCollection } from "@/lib/hooks";
import { ColumnDef } from "@tanstack/react-table";

export default function FacultyCourses() {
  const { user, token } = useAuth();
  const {
    data: facultyData,
    isLoading: facultyIsLoading,
    error: facultyError,
  } = useFetchCollection<FacultyResponse>(facultiesUrl, token, {
    depth: 2,
    where: { "user.email": { equals: user!.email } },
  });

  const faculty = facultyData?.docs?.at(0);
  const courses = faculty?.courses;

  // TODO: useMemo
  const columns: ColumnDef<Course>[] = [
    {
      accessorKey: "code",
      header: ({ column }) => {
        return <SortButton title="Code" column={column} />;
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return <SortButton title="Name" column={column} />;
      },
    },
    { accessorKey: "credits", header: "Credits" },
    { accessorKey: "duration", header: "Duration" },
    {
      accessorKey: "subjects",
      header: "Subjects",
      cell: ({ row }) => {
        return row.original.subjects.map((subject) => {
          return (
            <Badge className="mr-1 mb-1" key={subject.id}>
              {subject.name}
            </Badge>
          );
        });
      },
    },
  ];

  const isLoading = facultyIsLoading;
  const isError = !!facultyError;

  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Skeleton className="h-10" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-10" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-10" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from(
            {
              length: 10,
            },
            (_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={3}>
                  <Skeleton className="h-8 col-span-3" />
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    );
  }

  if (isError) {
    return <GenericError variant="error" />;
  }

  /*TODO: Better still, move this to parallel route layout */
  if (user?.roles === "admin") {
    return <GenericError variant="notImpl" />;
  }

  return <DataTable columns={columns} data={courses!} />;
}
