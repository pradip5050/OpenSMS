"use client";

import { useAuth } from "@/components/AuthProvider";
import GenericError from "@/components/GenericError";
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
import { AttendanceResponse, attendancesUrl } from "@/lib/dashboard/attendance";
import { useFetchCollection } from "@/lib/hooks";
import { groupBy } from "@/lib/utils";
import { PiCalendarBlankBold } from "react-icons/pi";

export default function Attendance() {
  const { token, user } = useAuth();
  const { data, isLoading, error } = useFetchCollection<AttendanceResponse>(
    attendancesUrl,
    token,
    { depth: 2, draft: false }
  );

  const courseGrouped = groupBy(["course", "value", "name"], data?.docs);
  const courseGroupedList = courseGrouped
    ? Object.entries(courseGrouped)
    : undefined;

  // {/* TODO: Convert to a more powerful DataTable instead */}
  if (isLoading) {
    return <Spinner size="32" />;
  }

  if (error) {
    return <GenericError variant="error" />;
  }

  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableHead>Course</TableHead>
          <TableHead>Days present</TableHead>
          <TableHead>Days absent</TableHead>
          <TableHead>Total days</TableHead>
          <TableHead>Percentage</TableHead>
          <TableHead>Daily attendance</TableHead>
        </TableRow>
        {courseGroupedList!.map(([course, data]) => {
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
                          present: "bg-constructive",
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
  );
}
