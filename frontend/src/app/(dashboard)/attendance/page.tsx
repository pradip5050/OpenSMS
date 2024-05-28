"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
      {/* TODO: Convert to a more powerful DataTable instead */}
      <Table>
        <TableBody>
          <TableRow>
            <TableHead>S.No</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Days present</TableHead>
            <TableHead>Days absent</TableHead>
            <TableHead>Total days</TableHead>
            <TableHead>Percentage</TableHead>
            <TableHead>Daily attendance</TableHead>
          </TableRow>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>Math</TableCell>
            <TableCell>7</TableCell>
            <TableCell>3</TableCell>
            <TableCell>10</TableCell>
            <TableCell>70%</TableCell>
            <TableCell>
              <Dialog>
                <DialogTrigger>
                  <Button>
                    <PiCalendarBlankBold />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Daily attendance calendar</DialogTitle>
                  </DialogHeader>
                  {/* TODO: Add daily attendance with https://react-day-picker.js.org/advanced-guides/custom-modifiers#custom-modifiers */}
                  <div className="flex items-center justify-center">
                    <Calendar />
                  </div>
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </main>
  );
}
