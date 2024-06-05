"use client";

import { useAuth } from "@/components/AuthProvider";
import Spinner from "@/components/Spinner";
import { useCourses } from "@/lib/dashboard/courses";

export default function Courses() {
  const { token } = useAuth();
  const { data, isLoading, error } = useCourses(token);

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
        <div>{JSON.stringify(data)}</div>
      )}
    </main>
  );
}
