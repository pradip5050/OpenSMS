"use client";

import { useAuth } from "@/components/AuthProvider";
import GenericError from "@/components/GenericError";
import Spinner from "@/components/Spinner";
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

  const student = data?.docs?.filter(
    (val) => val.user.value.email === user?.email
  )[0];

  if (isLoading) {
    return <Spinner size="32" />;
  }

  if (!!error) {
    return <GenericError variant="error" />;
  }

  return (
    <Table>
      <TableBody>
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
      </TableBody>
    </Table>
  );
}

// Design refs
// https://dribbble.com/shots/16659801-Student-Profile-Page-UI
// https://dribbble.com/shots/15433518-Uni-dashboard
// https://dribbble.com/shots/21981577-Student-Management-System
