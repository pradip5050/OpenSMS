"use client";

import { useAuth } from "@/components/AuthProvider";
import Spinner from "@/components/Spinner";
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
import { useAttendances } from "@/lib/dashboard/attendance";
import { groupBy } from "@/lib/utils";
import { PiCalendarBlankBold } from "react-icons/pi";

export default function Attendance() {
  const { token, user } = useAuth();
  const { data, isLoading, error } = useAttendances(token);

  const courseGrouped = groupBy(["course", "value", "name"], data?.docs);
  const courseGroupedList = courseGrouped
    ? Object.entries(courseGrouped)
    : undefined;

  return (
    <main className="min-h-screen w-full p-4 pt-20 flex flex-col">
      <div className="flex flex-row justify-between items-center pb-4">
        <h1 className="text-left w-full">Attendance</h1>
      </div>
      {/* TODO: Convert to a more powerful DataTable instead */}
      {isLoading || error ? (
        <div>
          <Spinner size="32" />
        </div>
      ) : (
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
            {courseGroupedList!.map(([course, data], index) => {
              const presentList = data
                .filter((val) => val.isPresent)
                .map((val) => new Date(val.date));
              const absentList = data
                .filter((val) => !val.isPresent)
                .map((val) => new Date(val.date));

              const numPresent = presentList.length;
              const numAbsent = absentList.length;
              const total = numAbsent + numPresent;
              const percentage = (numPresent / total) * 100;

              return (
                <TableRow key={course}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{course}</TableCell>
                  <TableCell>{numPresent}</TableCell>
                  <TableCell>{numAbsent}</TableCell>
                  <TableCell>{total}</TableCell>
                  <TableCell>{percentage.toFixed(2)}%</TableCell>
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
                        <div className="flex items-center justify-center">
                          <Calendar
                            modifiers={{
                              present: presentList!,
                              absent: absentList!,
                            }}
                            modifiersClassNames={{
                              // TODO: Make constructive class
                              present: "bg-green-600",
                              absent: "bg-destructive",
                            }}
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </main>
  );
}
