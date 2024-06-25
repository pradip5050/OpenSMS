"use client";

import { useAuth } from "@/components/AuthProvider";
import { DataTable } from "@/components/dashboard/DataTable";
import GenericError from "@/components/GenericError";
import Spinner from "@/components/Spinner";
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
import { ArrowUpDown } from "lucide-react";

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
    (val) => val.user.value.email === user!.email
  )[0];
  // TODO: Consider making parallel route for admin instead
  const courses = isAdmin(user!.roles)
    ? courseData?.docs
    : faculty?.courses?.map((val) => val.value);

  const columns: ColumnDef<Course>[] = [
    {
      accessorKey: "code",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Code
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    { accessorKey: "credits", header: "Credits" },
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
