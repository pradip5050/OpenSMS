"use client";

import { useAuth } from "@/components/AuthProvider";
import { DataTable } from "@/components/dashboard/DataTable";
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
import { Course } from "@/lib/dashboard/courses";
import { StudentResponse, studentsUrl } from "@/lib/dashboard/user-profile";
import { useFetchCollection } from "@/lib/hooks";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export default function Courses() {
  const { user, token } = useAuth();
  const { data, isLoading, error } = useFetchCollection<StudentResponse>(
    studentsUrl,
    token,
    { draft: false, depth: 2 }
  );

  // TODO: Get student by id directly instead of filters
  // FIXME: Student user existing but collection not existing causes errors
  const student = data?.docs?.filter(
    (val) => val.user.value.email === user!.email
  )[0];
  const courses = student?.courses?.map((val) => val.value);

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

  const isError = !!error;

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
    return (
      <div>
        <h1>Unable to load data</h1>
      </div>
    );
  }

  return <DataTable columns={columns} data={courses!} />;
}
