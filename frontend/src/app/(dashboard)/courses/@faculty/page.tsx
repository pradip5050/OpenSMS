"use client";

import { useAuth } from "@/components/AuthProvider";
import { DataTable } from "@/components/dashboard/DataTable";
import GenericError from "@/components/GenericError";
import SortButton from "@/components/SortButton";
import Spinner from "@/components/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Course, CourseResponse, coursesUrl } from "@/lib/dashboard/courses";
import { FacultyResponse, facultiesUrl } from "@/lib/dashboard/faculties";
import { useFetchCollection } from "@/lib/hooks";
import { isAdmin } from "@/lib/rbac";
import { ColumnDef } from "@tanstack/react-table";

export default function FacultyCourses() {
  const { user, token } = useAuth();
  const {
    data: facultyData,
    isLoading: facultyIsLoading,
    error: facultyError,
  } = useFetchCollection<FacultyResponse>(facultiesUrl, token);
  const {
    data: courseData,
    isLoading: courseIsLoading,
    error: courseError,
  } = useFetchCollection<CourseResponse>(coursesUrl, token);

  const faculty = facultyData?.docs?.filter(
    (val) => val.user.email === user!.email
  )[0];
  // TODO: Consider making parallel route for admin instead
  const courses = isAdmin(user!.roles) ? courseData?.docs : faculty?.courses;

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

  const isLoading = facultyIsLoading || courseIsLoading;
  const isError = !!facultyError || !!courseError;

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

  return <DataTable columns={columns} data={courses!} />;
}
