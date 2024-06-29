"use client";

import { useAuth } from "@/components/AuthProvider";
import { DataTable } from "@/components/dashboard/DataTable";
import GenericError from "@/components/GenericError";
import SortButton from "@/components/SortButton";
import Spinner from "@/components/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Progress as ProgressComponent } from "@/components/ui/progress";
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
import {
  Progress,
  progressesUrl,
  ProgressResponse,
} from "@/lib/dashboard/progresses";
import { StudentResponse, studentsUrl } from "@/lib/dashboard/students";
import { Subject } from "@/lib/dashboard/subjects";
import { useFetchCollection } from "@/lib/hooks";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ChevronsUpDown } from "lucide-react";

export default function Courses() {
  const { user, token } = useAuth();
  const {
    data: studentData,
    isLoading: studentIsLoading,
    error: studentError,
  } = useFetchCollection<StudentResponse>(studentsUrl, token, {
    draft: false,
    depth: 2,
    where: { "user.email": { equals: user!.email } },
  });
  const {
    data: progressData,
    isLoading: progressIsLoading,
    error: progressError,
  } = useFetchCollection<ProgressResponse>(progressesUrl, token, {
    draft: false,
    depth: 2,
    where: { "student.user.email": { equals: user!.email } },
  });

  console.log(progressData);

  const student = studentData?.docs?.at(0);
  const courses = student?.courses;
  const progresses = progressData?.docs;

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
            <ProgressComponent value={row.original.percent} max={100} />
          </div>
        );
      },
    },
  ];

  const isLoading = studentIsLoading || progressIsLoading;
  const isError = !!studentError || !!progressError;

  if (isLoading) {
    return <Spinner variant="page" />;
  }

  if (isError) {
    return <GenericError variant="error" />;
  }

  if (progresses!.length === 0) {
    return (
      <GenericError variant="noData" title="No progress data listed yet" />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {courses!.map((course) => {
        return (
          <Collapsible key={course.id}>
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{course.name}</span>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                      <ChevronsUpDown className="h-4 w-4" />
                      <span className="sr-only">Toggle</span>
                    </Button>
                  </CollapsibleTrigger>
                </CardTitle>
              </CardHeader>
              <CollapsibleContent className="space-y-2">
                <DataTable columns={columns} data={progresses!} />
              </CollapsibleContent>
            </Card>
          </Collapsible>
        );
      })}
    </div>
  );
}
