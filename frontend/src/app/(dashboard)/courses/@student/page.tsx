"use client";

import { useAuth } from "@/components/AuthProvider";
import { DataTable } from "@/components/dashboard/DataTable";
import GenericError from "@/components/GenericError";
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
import { Course } from "@/lib/dashboard/courses";
import { StudentResponse, studentsUrl } from "@/lib/dashboard/students";
import { useFetchCollection } from "@/lib/hooks";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export default function Courses() {
  const { user, token } = useAuth();
  const { data, isLoading, error } = useFetchCollection<StudentResponse>(
    studentsUrl,
    token,
    { draft: false, depth: 2, where: { "user.email": { equals: user!.email } } }
  );

  // FIXME: Student user existing but collection not existing causes errors
  const student = data?.docs?.at(0);
  const courses = student?.courses;

  const columns: ColumnDef<Course>[] = [
    {
      accessorKey: "code",
      header: ({ column }) => {
        return (
          <div className="flex items-center gap-1">
            Code
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <div className="flex items-center gap-1">
            Name
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        );
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

  const isError = !!error;

  if (isLoading) {
    return <Spinner variant="page" />;
  }

  if (isError) {
    return <GenericError variant="error" />;
  }

  if (courses!.length === 0) {
    return <GenericError variant="noData" title="No courses listed yet" />;
  }

  return (
    <div className="overflow-y-auto">
      <DataTable columns={columns} data={courses!} />
    </div>
  );
}
