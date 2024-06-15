"use client";

import { useAuth } from "@/components/AuthProvider";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import {
  StudentResponse,
  studentsUrl,
  studentTransformer,
} from "@/lib/dashboard/user-profile";
import { useFetchCollection } from "@/lib/hooks";
import Image from "next/image";

export default function UserProfile() {
  const { user, token } = useAuth();
  const { data, error, isLoading } = useFetchCollection<StudentResponse>(
    studentsUrl,
    token,
    { draft: false, depth: 2 },
    studentTransformer
  );

  // TODO: Query by ID instead of filtering
  const student = data?.docs?.filter(
    (val) => val.user.value.email === user?.email
  )[0];

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
              <div className="flex items-center justify-center pb-5">
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
                    {student!.user.value.name}
                  </div>
                </TableCell>
              </TableRow>
              <TableRow className="flex flex-row items-center justify-between">
                <TableCell>
                  <div className="font-medium text-3xl">Student ID</div>
                  <div className="text-lg text-muted-foreground md:inline">
                    {student!.studentId}
                  </div>
                </TableCell>
              </TableRow>
              <TableRow className="flex flex-row items-center justify-between">
                <TableCell>
                  <div className="font-medium text-3xl">Email</div>
                  <div className="text-lg text-muted-foreground md:inline">
                    {student!.user.value.email}
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
            </>
          )}
        </TableBody>
      </Table>
    </main>
  );
}

// Design refs
// https://dribbble.com/shots/16659801-Student-Profile-Page-UI
// https://dribbble.com/shots/15433518-Uni-dashboard
// https://dribbble.com/shots/21981577-Student-Management-System
