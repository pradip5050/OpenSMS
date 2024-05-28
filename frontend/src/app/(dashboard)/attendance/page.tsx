"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { PiCalendarBlankBold } from "react-icons/pi";

export default function Attendance() {
  return (
    <main className="min-h-screen w-full p-4 pt-20 flex flex-col">
      <div className="flex flex-row justify-between items-center pb-4">
        <h1 className="text-left w-full">Attendance</h1>
      </div>
      <Table>
        <TableBody>
          <TableRow>
            <TableHead>S.No</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Days present</TableHead>
            <TableHead>Days absent</TableHead>
            <TableHead>Total days</TableHead>
            <TableHead>Percentage</TableHead>
            <TableHead>Per day attendance</TableHead>
          </TableRow>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>Math</TableCell>
            <TableCell>7</TableCell>
            <TableCell>3</TableCell>
            <TableCell>10</TableCell>
            <TableCell>70%</TableCell>
            <TableCell>
              <Button>
                <PiCalendarBlankBold />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </main>
  );
}
