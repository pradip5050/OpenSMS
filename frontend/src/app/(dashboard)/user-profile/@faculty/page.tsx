"use client";

import { useAuth } from "@/components/AuthProvider";
import GenericError from "@/components/GenericError";
import Spinner from "@/components/Spinner";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import {
  facultiesUrl,
  FacultyResponse,
  facultyTransformer,
} from "@/lib/dashboard/faculties";
import { useFetchCollection } from "@/lib/hooks";
import Image from "next/image";

export default function UserProfile() {
  const { user, token } = useAuth();
  const { data, error, isLoading } = useFetchCollection<FacultyResponse>(
    facultiesUrl,
    token,
    {
      draft: false,
      depth: 2,
      where: { "user.email": { equals: user!.email } },
    },
    facultyTransformer
  );

  const faculty = data?.docs?.at(0);

  if (isLoading) {
    return <Spinner variant="page" />;
  }

  if (!!error) {
    return <GenericError variant="error" />;
  }

  /*TODO: Better still, move this to parallel route layout */
  if (user?.roles === "admin") {
    return (
      <GenericError
        variant="noData"
        title="Admin profile currently unavailable"
      />
    );
  }

  return (
    <Table>
      <TableBody>
        <div className="flex items-center justify-center pb-5">
          <Image
            className="rounded-full w-72 aspect-square"
            src={faculty!.photo.url}
            alt={faculty!.photo?.alt ?? ""}
            width={500}
            height={500}
          ></Image>
        </div>
        <TableRow className="flex flex-row items-center justify-between">
          <TableCell>
            <div className="font-medium text-3xl">Name</div>
            <div className="text-lg text-muted-foreground md:inline">
              {faculty!.user.name}
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="flex flex-row items-center justify-between">
          <TableCell>
            <div className="font-medium text-3xl">Faculty ID</div>
            <div className="text-lg text-muted-foreground md:inline">
              {faculty!.facultyId}
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="flex flex-row items-center justify-between">
          <TableCell>
            <div className="font-medium text-3xl">Email</div>
            <div className="text-lg text-muted-foreground md:inline">
              {faculty!.user.email}
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="flex flex-row items-center justify-between">
          <TableCell>
            <div className="font-medium text-3xl">Date Of Birth</div>
            <div className="text-lg text-muted-foreground md:inline">
              {faculty!.dob}
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="flex flex-row items-center justify-between">
          <TableCell>
            <div className="font-medium text-3xl">Number</div>
            <div className="text-lg text-muted-foreground md:inline">
              {faculty!.number}
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="flex flex-row items-center justify-between">
          <TableCell>
            <div className="font-medium text-3xl">Subjects</div>
            <div className="text-lg text-muted-foreground md:inline">
              {faculty!.subjects.map((subject) => (
                <Badge key={subject.id}>{subject.name}</Badge>
              ))}
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
