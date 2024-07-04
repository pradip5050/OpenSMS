"use client";

import { useAuth } from "@/components/AuthProvider";
import { DataTable } from "@/components/dashboard/DataTable";
import GenericError from "@/components/GenericError";
import SortButton from "@/components/SortButton";
import Spinner from "@/components/Spinner";
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
import { Course, CourseResponse, coursesUrl } from "@/lib/dashboard/courses";
import { useFetchCollection } from "@/lib/hooks";
import { ColumnDef } from "@tanstack/react-table";

export default function FacultyCourses() {
  const { token } = useAuth();
  const {
    data: courseData,
    isLoading: courseIsLoading,
    error: courseError,
  } = useFetchCollection<CourseResponse>(coursesUrl, token);

  const courses = courseData?.docs;

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

  const isLoading = courseIsLoading;
  const isError = !!courseError;

  if (isLoading) {
    return <Spinner variant="page" />;
  }

  if (isError) {
    return <GenericError variant="error" />;
  }

  return <DataTable columns={columns} data={courses!} />;
}
