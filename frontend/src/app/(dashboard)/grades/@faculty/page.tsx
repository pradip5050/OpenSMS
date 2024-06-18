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
import { Grade, GradeResponse, gradesUrl } from "@/lib/dashboard/grades";
import { StudentResponse, studentsUrl } from "@/lib/dashboard/user-profile";
import { useFetchCollection } from "@/lib/hooks";
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
  const {
    data: studentData,
    error: studentError,
    isLoading: studentIsLoading,
  } = useFetchCollection<StudentResponse>(studentsUrl, token, {
    depth: 2,
    draft: false,
  });
  const [value, setValue] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const studentGradesData = gradesData?.docs?.filter(
    (grade) => grade.student.value.id === value
  );
  const students = studentData?.docs;
  const studentsOptions = students?.map((val) => {
    return { value: val.id, label: val.user.value.name };
  });

  const groupedCourses = groupBy(
    ["course", "value", "name"],
    studentGradesData
  );
  console.log(groupedCourses);

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
                  <DropdownMenuItem onClick={() => {}}>Edit</DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuItem className="bg-destructive" onClick={() => {}}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <GradeDialog
              student={row.original.student.value.id}
              course={row.original.course.value.id}
            />
          </Dialog>
        );
      },
    },
  ];

  const isLoading = gradesIsLoading || studentIsLoading;
  const isError = gradesError || studentError;

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
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add new</Button>
            </DialogTrigger>
            <GradeDialog />
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
