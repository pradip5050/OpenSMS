"use client";

import { useAuth } from "@/components/AuthProvider";
import { Combobox } from "@/components/dashboard/Combobox";
import { DataTable } from "@/components/dashboard/DataTable";
import GenericError from "@/components/GenericError";
import SortButton from "@/components/SortButton";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
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
import {
  Progress,
  progressesUrl,
  ProgressResponse,
} from "@/lib/dashboard/progresses";
import { StudentResponse, studentsUrl } from "@/lib/dashboard/students";
import { useFetchCollection } from "@/lib/hooks";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

export default function FacultyCourses() {
  const { user, token } = useAuth();
  const {
    data: studentData,
    isLoading: studentIsLoading,
    error: studentError,
  } = useFetchCollection<StudentResponse>(studentsUrl, token, {
    depth: 2,
  });
  const {
    data: facultyData,
    isLoading: facultyIsLoading,
    error: facultyError,
  } = useFetchCollection<FacultyResponse>(facultiesUrl, token, {
    depth: 2,
    where: { "user.email": { equals: user!.email } },
  });
  const {
    data: progressData,
    isLoading: progressIsLoading,
    error: progressError,
  } = useFetchCollection<ProgressResponse>(progressesUrl, token, {
    depth: 2,
  });

  const [value, setValue] = useState("");

  const faculty = facultyData?.docs?.at(0);
  const student = studentData?.docs?.filter((student) => student.id === value);
  const courses = faculty?.courses;
  const progresses = progressData?.docs;

  const studentsOptions = studentData?.docs?.map((val) => {
    return { value: val.id, label: val.user.name };
  });

  // ! Select student from combobox
  // ! Then filter student course.subjects by faculty.subjects
  // ! Then display a table of subjects with sliders

  // TODO: useMemo
  const columns: ColumnDef<Progress>[] = [
    {
      accessorKey: "subject",
      header: "Subject",
      cell: ({ row }) => {
        return row.original.subject.name;
      },
    },
    {
      accessorKey: "percent",
      header: "Progress",
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <span className="w-12">{row.original.percent}%</span>
            <Slider defaultValue={[row.original.percent]} max={100} step={1} />
          </div>
        );
      },
    },
  ];

  const isLoading = facultyIsLoading || studentIsLoading || progressIsLoading;
  const isError = !!facultyError || !!studentError || !!progressError;

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

  return (
    <div className="flex flex-col gap-3 overflow-y-auto">
      <div className="flex justify-between">
        <Combobox
          options={studentsOptions!}
          label="student"
          state={{ value: value, setValue: setValue }}
        />
      </div>
      <DataTable columns={columns} data={progresses!} />
    </div>
  );
}
