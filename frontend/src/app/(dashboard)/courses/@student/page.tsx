"use client";

import { useAuth } from "@/components/AuthProvider";
import { DataTable } from "@/components/dashboard/DataTable";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Course } from "@/lib/dashboard/courses";
import { useStudents } from "@/lib/dashboard/user-profile";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export default function Courses() {
  const { user, token } = useAuth();
  const { data, isLoading, error } = useStudents(token);

  // TODO: Get student by id directly instead of filters
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

  return (
    <main className="min-h-screen w-full p-4 pt-20 flex flex-col max-h-screen">
      <div className="flex flex-row justify-between items-center pb-4">
        <h1 className="text-left w-full">Courses</h1>
      </div>
      {isLoading || error ? (
        <>
          <Spinner size="32" />
        </>
      ) : (
        <DataTable columns={columns} data={courses!} />
      )}
    </main>
  );
}
