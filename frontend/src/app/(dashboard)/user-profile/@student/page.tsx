"use client";

import { useAuth } from "@/components/AuthProvider";
import GenericError from "@/components/GenericError";
import Spinner from "@/components/Spinner";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import {
  StudentResponse,
  studentsUrl,
  studentTransformer,
} from "@/lib/dashboard/students";
import { useFetchCollection } from "@/lib/hooks";
import { Link2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function UserProfile() {
  const { user, token } = useAuth();
  const { data, error, isLoading } = useFetchCollection<StudentResponse>(
    studentsUrl,
    token,
    {
      draft: false,
      depth: 2,
      where: { "user.email": { equals: user!.email } },
    },
    studentTransformer
  );
  const student = data?.docs?.at(0);

  if (isLoading) {
    return <Spinner size="32" />;
  }

  if (!!error || !student) {
    return <GenericError variant="error" />;
  }

  return (
    <div className="overflow-auto">
      <div className="flex items-center justify-center pb-5">
        <Image
          className="rounded-full w-72 aspect-square"
          src={student!.photo.url}
          alt={student!.photo?.alt ?? "Profile photo"}
          width={500}
          height={500}
        ></Image>
      </div>
      <Table>
        <TableBody>
          <TableRow className="flex flex-row items-center justify-between">
            <TableCell>
              <div className="font-medium text-3xl">Name</div>
              <div className="text-lg text-muted-foreground md:inline">
                {student!.user.name}
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
                {student!.user.email}
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
          {student!.links.length !== 0 && (
            <TableRow className="flex flex-row items-center justify-between">
              <TableCell className="flex flex-col gap-3 w-full">
                <div className="font-medium text-3xl">Portfolio links</div>
                {student!.links.map((link) => {
                  return (
                    <Link
                      key={link.title}
                      href={link.url}
                      className="flex items-center gap-4 rounded-lg bg-background p-4 transition-colors hover:bg-muted hover:text-primary"
                      prefetch={false}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                        <Link2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{link.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {link.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
