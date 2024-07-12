"use client";

import { useAuth } from "@/components/AuthProvider";
import { Combobox } from "@/components/dashboard/Combobox";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFetchCollection, useMutateCollection } from "@/lib/hooks";
import { cn, constructiveToast, destructiveToast } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import React from "react";
import { DateRange } from "react-day-picker";
import { addDays, format, differenceInDays } from "date-fns";
import {
  Student,
  StudentResponse,
  studentsUrl,
} from "@/lib/dashboard/students";
import {
  Table,
  TableHeader,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
} from "@/components/ui/table";
import { Check } from "lucide-react";
import {
  Attendance,
  AttendancePayload,
  AttendanceResponse,
  attendancesUrl,
} from "@/lib/dashboard/attendance";
import { Toggle } from "@/components/ui/toggle";
import { useToast } from "@/components/ui/use-toast";
import GenericError from "@/components/GenericError";
import { CourseResponse, coursesUrl } from "@/lib/dashboard/courses";

export default function FacultyAttendancePage() {
  const { token } = useAuth();

  const {
    data: attendanceData,
    isLoading: attendanceIsLoading,
    error: attendanceError,
  } = useFetchCollection<AttendanceResponse>(attendancesUrl, token, {
    draft: false,
    depth: 2,
  });
  const {
    data: studentData,
    isLoading: studentIsLoading,
    error: studentError,
  } = useFetchCollection<StudentResponse>(studentsUrl, token, {
    draft: false,
    depth: 2,
  });
  const {
    data: courseData,
    isLoading: courseIsLoading,
    error: courseError,
  } = useFetchCollection<CourseResponse>(coursesUrl, token, {
    draft: false,
    depth: 2,
  });
  const [value, setValue] = React.useState("");
  const [date, setDate] = React.useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 10),
  });
  const { toast } = useToast();

  const studentsByCourse = studentData?.docs?.filter((student) =>
    student.courses.map((course) => course.id).some((id) => id === value)
  );

  const dates = Array.from(
    {
      length:
        differenceInDays(
          date?.to ?? addDays(Date.now(), 3),
          date?.from ?? Date.now()
        ) + 1,
    },
    (_, i) => addDays(date?.from ?? Date.now(), i)
  );

  const {
    trigger: attendanceCreateTrigger,
    error: attendanceCreateError,
    isMutating: attendanceCreateIsMutating,
  } = useMutateCollection<
    { doc: Attendance },
    AttendanceResponse,
    AttendancePayload
  >(attendancesUrl, "POST", (attendance, data) => {
    try {
      return {
        docs: [...data!.docs!, attendance.doc],
      };
    } catch (err) {
      return data!;
    }
  });
  const {
    trigger: attendanceUpdateTrigger,
    error: attendanceUpdateError,
    isMutating: attendanceUpdateIsMutating,
  } = useMutateCollection<
    { doc: Attendance },
    AttendanceResponse,
    AttendancePayload
  >(attendancesUrl, "PATCH", (attendance, data) => {
    try {
      return {
        docs: [
          ...data!.docs!.filter((val) => val.id === attendance.doc.id),
          attendance.doc,
        ],
      };
    } catch (err) {
      return data!;
    }
  });

  async function togglePresent(
    date: Date,
    student: Student,
    isPresent: boolean
  ) {
    const existingAttendance = attendanceData!.docs!.filter(
      (attendance) =>
        attendance.course.id === value &&
        attendance.student.id === student.id &&
        new Date(attendance.date).getDate() === date.getDate()
    )[0]?.id;

    if (existingAttendance) {
      await attendanceUpdateTrigger({
        token: token!,
        id: existingAttendance,
        query: { depth: 2 },
        payload: {
          date: date.toISOString(),
          isPresent: !isPresent,
          course: value,
          student: student.id,
        },
      });
    } else {
      await attendanceCreateTrigger({
        token: token!,
        query: { depth: 2 },
        payload: {
          date: date.toISOString(),
          isPresent: !isPresent,
          course: value,
          student: student.id,
        },
      });
    }

    if (attendanceCreateError || attendanceUpdateError) {
      destructiveToast(toast, "Error", "Failed to update attendance")();
    } else {
      constructiveToast(toast, "Success", "Updated attendance")();
    }
  }

  const courseOptions = courseData?.docs?.map((val) => {
    return { value: val.id, label: val.name };
  });

  const isLoading = attendanceIsLoading || studentIsLoading || courseIsLoading;
  const isError = !!attendanceError || !!studentError || !!courseError;
  const isMutating = attendanceCreateIsMutating || attendanceUpdateIsMutating;

  if (isLoading) {
    return <Spinner variant="page" />;
  }

  if (isError) {
    return <GenericError variant="error" />;
  }

  return (
    <div className="flex flex-col gap-3 overflow-y-auto">
      <div className="flex justify-between">
        <Combobox
          options={courseOptions!}
          label="course"
          state={{ value: value, setValue: setValue }}
        />
        {value !== "" && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto py-0 ">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={(range) => setDate(range!)}
                numberOfMonths={2}
                min={3}
                max={10}
              />
            </PopoverContent>
          </Popover>
        )}
      </div>
      {value !== "" && (
        <Table className="block md:max-w-[calc(100vw-16rem)] overflow-auto">
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              {dates.map((date) => (
                <TableHead key={date.toISOString()}>
                  {`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {studentsByCourse?.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.user.name}</TableCell>
                {dates.map((date) => {
                  const currentAttendances = attendanceData!.docs!.filter(
                    (attendance) => {
                      return (
                        attendance.course.id === value &&
                        attendance.student.id === student.id &&
                        new Date(attendance.date).toDateString() ===
                          date.toDateString()
                      );
                    }
                  );
                  const currentAttendance =
                    currentAttendances[currentAttendances.length - 1]
                      ?.isPresent;

                  return (
                    <TableCell key={date.toISOString()}>
                      <Toggle
                        value="bold"
                        aria-label="Toggle present"
                        variant="outline"
                        className={cn([
                          // FIXME: constructive not displaying properly
                          "data-[state=on]:bg-inherit bg-inherit w-10 aspect-square",
                          currentAttendance && "bg-constructive",
                        ])}
                        onClick={() => {
                          if (!isMutating) {
                            togglePresent(date, student, !!currentAttendance);
                          }
                        }}
                      >
                        {currentAttendance && <Check className="h-4 w-4" />}
                      </Toggle>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
