"use client";

import { useAuth } from "@/components/AuthProvider";
import { DataTable } from "@/components/dashboard/DataTable";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Course, CourseResponse, coursesUrl } from "@/lib/dashboard/courses";
import { FacultyResponse, facultiesUrl } from "@/lib/dashboard/faculties";
import { Grade, GradeResponse, gradesUrl } from "@/lib/dashboard/grades";
import { useFetchCollection } from "@/lib/hooks";
import { isAdmin } from "@/lib/rbac";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

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
            Code
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
        // TODO: Create collapsible datatables per course
        <DataTable columns={columns} data={studentGradesData!} />
      )}
    </main>
  );
}
