"use client";

import { useAuth } from "@/components/AuthProvider";
import { Combobox } from "@/components/dashboard/Combobox";
import { DataTable } from "@/components/dashboard/DataTable";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { facultiesUrl, FacultyResponse } from "@/lib/dashboard/faculties";
import { useFetchCollection, useMutateCollection } from "@/lib/hooks";
import { cn, groupBy } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import React from "react";
import { DateRange } from "react-day-picker";
import { addDays, format, differenceInDays } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import {
  Student,
  StudentResponse,
  studentsUrl,
} from "@/lib/dashboard/user-profile";
import {
  Table,
  TableHeader,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Check, X } from "lucide-react";
import {
  Attendance,
  AttendancePayload,
  AttendanceResponse,
  attendancesUrl,
} from "@/lib/dashboard/attendance";
import { Toggle } from "@/components/ui/toggle";

export default function FacultyAttendancePage() {
  const { token, user } = useAuth();

  const {
    data: attendanceData,
    isLoading: attendanceIsLoading,
    error: attendanceError,
  } = useFetchCollection<AttendanceResponse>(attendancesUrl, token, {
    draft: false,
    depth: 2,
  });
  const {
    data: facultyData,
    isLoading: facultyIsLoading,
    error: facultyError,
  } = useFetchCollection<FacultyResponse>(facultiesUrl, token, {
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
  const [value, setValue] = React.useState("");
  const [date, setDate] = React.useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 10),
  });

  const faculty = facultyData?.docs?.at(0);
  const facultyCourseOptions = faculty?.courses.map((val) => {
    return { value: val.value.id, label: val.value.name };
  });
  const studentsByCourse = studentData?.docs?.filter((student) =>
    student.courses.map((course) => course.value.id).some((id) => id === value)
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

  // TODO: memoize with useMemo
  // https://tanstack.com/table/latest/docs/guide/data#give-data-a-stable-reference
  // const columns: ColumnDef<{ date: Date }>[] = dates.map((date) => {
  //   return { accessorKey: date, header: date.getDate() } satisfies ColumnDef<{
  //     date: Date;
  //   }>;
  // });

  const {
    trigger: attendanceCreateTrigger,
    error: attendanceCreateError,
    isMutating: attendanceCreateIsMutating,
  } = useMutateCollection<Attendance, AttendanceResponse, AttendancePayload>(
    attendancesUrl,
    "POST",
    undefined
  );

  async function togglePresent(
    date: Date,
    student: Student,
    isPresent: boolean
  ) {
    const res = await attendanceCreateTrigger({
      token: token!,
      payload: {
        date: date.toISOString(),
        isPresent: !isPresent,
        course: { relationTo: "courses", value: value },
        student: { relationTo: "students", value: student.id },
      },
    });

    console.log(res);
  }
  // FIXME: Prevent multiple POST's if attendance already exists
  // That is, get attendance id for that day,student,course and make a PATCH request

  const isLoading = attendanceIsLoading || studentIsLoading || facultyIsLoading;
  const isError = !!attendanceError || !!studentError || !!facultyError;

  return (
    <main className="min-h-screen w-full p-4 pt-20 flex flex-col">
      <div className="flex flex-row justify-between items-center pb-4">
        <h1 className="text-left w-full">Attendance</h1>
      </div>
      {isLoading || isError ? (
        <div>
          <Spinner size="32" />
        </div>
      ) : (
        <div className="flex flex-col gap-3 overflow-y-auto">
          <div className="flex justify-between">
            <Combobox
              options={facultyCourseOptions!}
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
          {/* <DataTable columns={columns} data={studentFeeData!} /> */}
          <Table className="block md:max-w-[calc(100vw-16rem)] overflow-auto">
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                {dates.map((date) => (
                  <TableHead key={date.toISOString()}>
                    {`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentsByCourse?.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.user.value.name}</TableCell>
                  {dates.map((date) => {
                    const currentAttendances = attendanceData!.docs!.filter(
                      (attendance) => {
                        return (
                          attendance.course.value.id === value &&
                          attendance.student.value.id === student.id &&
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
                          className={cn([
                            currentAttendance && "bg-constructive",
                            "data-[state=on]:bg-constructive",
                          ])}
                          onClick={() =>
                            togglePresent(date, student, !!currentAttendance)
                          }
                        >
                          <Check className="h-4 w-4" />
                        </Toggle>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </main>
  );
}
