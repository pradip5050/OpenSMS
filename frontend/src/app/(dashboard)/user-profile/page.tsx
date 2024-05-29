"use client";

import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";

export default function UserProfile() {
  return (
    <main className="min-h-screen w-full p-4 pt-20 flex flex-col max-h-screen">
      <div className="flex flex-row justify-between items-center pb-4">
        <h1 className="text-left w-full">User Profile</h1>
      </div>
      <Table>
        <TableBody>
          <TableRow className="flex flex-row items-center justify-between">
            <TableCell>
              <div className="font-medium text-3xl">Name</div>
              <div className="text-lg text-muted-foreground md:inline">abc</div>
            </TableCell>
          </TableRow>
          <TableRow className="flex flex-row items-center justify-between">
            <TableCell>
              <div className="font-medium text-3xl">Email</div>
              <div className="text-lg text-muted-foreground md:inline">
                a@b.com
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </main>
  );
}

// Design refs
// https://dribbble.com/shots/16659801-Student-Profile-Page-UI
// https://dribbble.com/shots/15433518-Uni-dashboard
// https://dribbble.com/shots/21981577-Student-Management-System
