"use client";

import { useAuth } from "@/components/AuthProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { mapStudent, useStudent } from "@/lib/dashboard/user-profile";
import Image from "next/image";

export default function UserProfile() {
  const { user, token } = useAuth();
  const { data, error, isLoading } = useStudent(user!.email);

  const student = mapStudent(data?.docs[0]);

  return (
    <main className="min-h-screen w-full p-4 pt-20 flex flex-col max-h-screen">
      <div className="flex flex-row justify-between items-center pb-4">
        <h1 className="text-left w-full">User Profile</h1>
      </div>
      <Table>
        <TableBody>
          {error || isLoading ? (
            <h1>{JSON.stringify(error)}</h1>
          ) : (
            <>
              {/* TODO: Fix src URL (add API_URL) */}
              <div className="flex items-center justify-center">
                <Image
                  className="rounded-full w-72 aspect-square"
                  src={student!.photo.url}
                  alt={student!.photo.alt}
                  width={500}
                  height={500}
                ></Image>
              </div>
              <TableRow className="flex flex-row items-center justify-between">
                <TableCell>
                  <div className="font-medium text-3xl">Name</div>
                  <div className="text-lg text-muted-foreground md:inline">
                    {student!.name}
                  </div>
                </TableCell>
              </TableRow>
              <TableRow className="flex flex-row items-center justify-between">
                <TableCell>
                  <div className="font-medium text-3xl">Email</div>
                  <div className="text-lg text-muted-foreground md:inline">
                    {student!.email}
                  </div>
                </TableCell>
              </TableRow>
              <TableRow className="flex flex-row items-center justify-between">
                <TableCell>
                  <div className="font-medium text-3xl">Date Of Birth</div>
                  <div className="text-lg text-muted-foreground md:inline">
                    {student!.dob}
                  </div>
                </TableCell>
              </TableRow>
              <TableRow className="flex flex-row items-center justify-between">
                <TableCell>
                  <div className="font-medium text-3xl">Number</div>
                  <div className="text-lg text-muted-foreground md:inline">
                    {student!.number}
                  </div>
                </TableCell>
              </TableRow>
              <TableRow className="flex flex-row items-center justify-between">
                <TableCell>
                  <div className="font-medium text-3xl">Student ID</div>
                  <div className="text-lg text-muted-foreground md:inline">
                    {student!.id}
                  </div>
                </TableCell>
              </TableRow>
              <TableRow className="flex flex-row items-center justify-between">
                <TableCell>
                  <div className="font-medium text-3xl">Courses</div>
                  <div className="text-lg text-muted-foreground md:inline">
                    {student!.courses}
                  </div>
                </TableCell>
              </TableRow>
            </>
          )}{" "}
        </TableBody>
      </Table>
    </main>
  );
}

// Design refs
// https://dribbble.com/shots/16659801-Student-Profile-Page-UI
// https://dribbble.com/shots/15433518-Uni-dashboard
// https://dribbble.com/shots/21981577-Student-Management-System
