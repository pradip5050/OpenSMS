"use client";

import { useAuth } from "@/components/AuthProvider";
import { DataTable } from "@/components/dashboard/DataTable";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Course, CourseResponse, coursesUrl } from "@/lib/dashboard/courses";
import { FacultyResponse, facultiesUrl } from "@/lib/dashboard/faculties";
import { useStudents } from "@/lib/dashboard/user-profile";
import { useFetchCollection } from "@/lib/hooks";
import { isAdmin } from "@/lib/rbac";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export default function FacultyCourses() {
  const { user, token } = useAuth();
  const {
    data: facultyData,
    isLoading: facultyIsLoading,
    error: facultyError,
  } = useFetchCollection<FacultyResponse>(facultiesUrl, token);
  const {
    data: courseData,
    isLoading: courseIsLoading,
    error: courseError,
  } = useFetchCollection<CourseResponse>(coursesUrl, token);

  // TODO: Get faculty by id directly instead of filters
  const faculty = facultyData?.docs?.filter(
    (val) => val.user.value.email === user!.email
  )[0];
  // TODO: Consider making parallel route for admin instead
  const courses = isAdmin(user!.roles)
    ? courseData?.docs
    : faculty?.courses?.map((val) => val.value);

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
      {facultyIsLoading || facultyError || courseIsLoading || courseError ? (
        <>
          <Spinner size="32" />
        </>
      ) : (
        <DataTable columns={columns} data={courses!} />
      )}
    </main>
  );
}
