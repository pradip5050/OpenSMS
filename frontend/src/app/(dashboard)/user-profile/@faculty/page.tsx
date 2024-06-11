"use client";

import { useAuth } from "@/components/AuthProvider";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import {
  FacultyResponse,
  facultyTransformer,
  facultyUrl,
} from "@/lib/dashboard/faculties";
import { useFetchCollection } from "@/lib/hooks";
import Image from "next/image";

export default function UserProfile() {
  const { user, token } = useAuth();
  const { data, error, isLoading } = useFetchCollection<FacultyResponse>(
    facultyUrl,
    token,
    facultyTransformer
  );

  // TODO: Query by ID instead of filtering
  const faculty = data?.docs?.filter(
    (val) => val.user.value.email === user?.email
  )[0];
  console.log(data);

  return (
    <main className="min-h-screen w-full p-4 pt-20 flex flex-col max-h-screen">
      <div className="flex flex-row justify-between items-center pb-4">
        <h1 className="text-left w-full">User Profile</h1>
      </div>
      <Table>
        <TableBody>
          {/* TODO: Display - admins do not have user profile */}
          {/* Better still, move this to parallel route layout */}
          {error || isLoading || user?.roles === "admin" ? (
            <h1>{JSON.stringify(error)}</h1>
          ) : (
            <>
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
                    {faculty!.user.value.name}
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
                    {faculty!.user.value.email}
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
            </>
          )}
        </TableBody>
      </Table>
    </main>
  );
}
