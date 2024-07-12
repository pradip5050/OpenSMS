"use client";

import { useAuth } from "@/components/AuthProvider";
import { DataTable } from "@/components/dashboard/DataTable";
import GenericError from "@/components/GenericError";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Progress as ProgressComponent } from "@/components/ui/progress";

import {
  Progress,
  progressesUrl,
  ProgressResponse,
} from "@/lib/dashboard/progresses";
import { StudentResponse, studentsUrl } from "@/lib/dashboard/students";
import { useFetchCollection } from "@/lib/hooks";
import { groupBy } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import { useMemo } from "react";

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

  const student = studentData?.docs?.at(0);
  const courses = student?.courses;
  const progresses = progressData?.docs;

  const columns: ColumnDef<Progress>[] = useMemo(
    () => [
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
    ],
    []
  );

  //  Make an object of { course.name, subject } and then groupBy course.name
  const progressesWithCourse = progresses?.map((progress) => {
    return {
      ...progress,
      course: courses
        ?.filter((course) =>
          course.subjects
            .map((subject) => subject.id)
            .some((val) => val === progress.subject.id)
        )
        ?.map((course) => course.name),
    };
  });
  const groupedProgresses = groupBy(["course"], progressesWithCourse);

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
      {Object.entries(groupedProgresses!).map(([course, progresses]) => {
        return (
          <Collapsible key={course}>
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{course}</span>
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
