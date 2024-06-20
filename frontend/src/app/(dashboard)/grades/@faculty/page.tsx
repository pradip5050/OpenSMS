"use client";

import { useAuth } from "@/components/AuthProvider";
import { Combobox } from "@/components/dashboard/Combobox";
import { DataTable } from "@/components/dashboard/DataTable";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  Grade,
  GradePayload,
  GradeResponse,
  gradesUrl,
} from "@/lib/dashboard/grades";
import { StudentResponse, studentsUrl } from "@/lib/dashboard/user-profile";
import { useFetchCollection, useMutateCollection } from "@/lib/hooks";
import { groupBy } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ChevronsUpDown } from "lucide-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { GradeDialog } from "@/components/dashboard/grades/GradeDialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { facultiesUrl, FacultyResponse } from "@/lib/dashboard/faculties";

export default function StudentGrades() {
  const { user, token } = useAuth();
  const {
    data: gradesData,
    isLoading: gradesIsLoading,
    error: gradesError,
  } = useFetchCollection<GradeResponse>(gradesUrl, token, {
    draft: false,
    depth: 2,
  });
  const { trigger: gradeDeleteTrigger, isMutating: gradeDeleteIsMutating } =
    useMutateCollection<Grade, GradeResponse, GradePayload>(
      gradesUrl,
      "DELETE",
      (result, data) => {
        return { docs: data!.docs!.filter((val) => val.id !== result.id) };
      }
    );

  const {
    data: studentData,
    error: studentError,
    isLoading: studentIsLoading,
  } = useFetchCollection<StudentResponse>(studentsUrl, token, {
    depth: 2,
    draft: false,
  });
  const {
    data: facultyData,
    isLoading: facultyIsLoading,
    error: facultyError,
  } = useFetchCollection<FacultyResponse>(facultiesUrl, token, {
    depth: 2,
    draft: false,
  });
  const [value, setValue] = React.useState("");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);

  const studentGradesData = gradesData?.docs?.filter(
    (grade) => grade.student.value.id === value
  );
  const students = studentData?.docs;
  const faculty = facultyData?.docs![0];

  const facultyCourses = faculty?.courses.map((course) => course.value);
  // TODO: Simplify
  const facultyCourseStudents = students?.filter((val) =>
    val.courses
      .map((course) => course.value)
      .some((course) =>
        facultyCourses
          ?.map((facultyCourse) => facultyCourse.id)
          ?.includes(course.id)
      )
  );

  const studentsOptions = facultyCourseStudents?.map((val) => {
    return { value: val.id, label: val.user.value.name };
  });

  const groupedCourses = groupBy(
    ["course", "value", "name"],
    studentGradesData
  );
  // console.log(groupedCourses);

  const columns: ColumnDef<Grade>[] = [
    { accessorKey: "testType", header: "Test Type" },
    {
      accessorKey: "marks",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Marks
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    { accessorKey: "maxMarks", header: "Max Marks" },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DialogTrigger asChild>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuItem
                  className="bg-destructive"
                  disabled={isMutating}
                  onClick={async () => {
                    await gradeDeleteTrigger({
                      token: token!,
                      id: row.original.id,
                      payload: {},
                    });
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <GradeDialog
              id={row.original.id}
              student={row.original.student.value.id}
              course={row.original.course.value.id}
              marks={row.original.marks}
              maxMarks={row.original.maxMarks}
              testType={row.original.testType}
              setOpen={setEditOpen}
            />
          </Dialog>
        );
      },
    },
  ];

  const isLoading = gradesIsLoading || studentIsLoading || facultyIsLoading;
  const isError = gradesError || studentError || facultyError;
  const isMutating = gradeDeleteIsMutating;

  if (isLoading) {
    return <Spinner size="32" />;
  }

  if (isError) {
    return <div>Failed to load data</div>;
  }

  return (
    <div className="flex flex-col gap-2 overflow-y-auto">
      <div className="flex justify-between">
        <Combobox
          options={studentsOptions!}
          label="student"
          state={{ value: value, setValue: setValue }}
        />
        {value != "" && (
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>Add new</Button>
            </DialogTrigger>
            <GradeDialog
              facultyCourses={facultyCourses}
              student={value}
              setOpen={setCreateOpen}
            />
          </Dialog>
        )}
      </div>
      {Object.entries(groupedCourses!).map(([course, grades]) => {
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
                <DataTable columns={columns} data={grades!} />
              </CollapsibleContent>
            </Card>
          </Collapsible>
        );
      })}
    </div>
  );
}
