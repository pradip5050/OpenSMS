"use client";

import { useAuth } from "@/components/AuthProvider";
import GenericError from "@/components/GenericError";
import Spinner from "@/components/Spinner";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { useFetchCollection } from "@/lib/hooks";
import { UserResponse, usersUrl } from "@/lib/login/login";

export default function UserProfile() {
  const { user, token } = useAuth();
  const { data, error, isLoading } = useFetchCollection<UserResponse>(
    usersUrl,
    token,
    {
      draft: false,
      depth: 2,
      where: { email: { equals: user!.email } },
    }
  );

  const admin = data?.docs?.at(0);

  if (isLoading) {
    return <Spinner variant="page" />;
  }

  if (!!error) {
    return <GenericError variant="error" />;
  }

  return (
    <Table>
      <TableBody>
        <TableRow className="flex flex-row items-center justify-between">
          <TableCell>
            <div className="font-medium text-3xl">Name</div>
            <div className="text-lg text-muted-foreground md:inline">
              {admin!.name}
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="flex flex-row items-center justify-between">
          <TableCell>
            <div className="font-medium text-3xl">Email</div>
            <div className="text-lg text-muted-foreground md:inline">
              {admin!.email}
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
