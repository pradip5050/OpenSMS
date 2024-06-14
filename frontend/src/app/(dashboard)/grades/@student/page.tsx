"use client";

import { useAuth } from "@/components/AuthProvider";
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
import { useFetchCollection } from "@/lib/hooks";
import { groupBy } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ChevronsUpDown } from "lucide-react";
import React from "react";

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

  const studentGradesData = gradesData?.docs?.filter(
    (grade) => grade.student.value.user.value.email === user!.email
  );

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
  ];

  return (
    <main className="min-h-screen w-full p-4 pt-20 flex flex-col max-h-screen">
      <div className="flex flex-row justify-between items-center pb-4">
        <h1 className="text-left w-full">Grades</h1>
      </div>
      {gradesIsLoading || gradesError ? (
        <>
          <Spinner size="32" />
        </>
      ) : (
        <div className="flex flex-col gap-2 overflow-y-auto">
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
      )}
    </main>
  );
}
