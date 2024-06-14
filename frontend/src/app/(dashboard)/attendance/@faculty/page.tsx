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
import { useFetchCollection } from "@/lib/hooks";
import { cn, groupBy } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import React from "react";
import { DateRange } from "react-day-picker";
import { addDays, format, differenceInDays } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { StudentResponse, studentsUrl } from "@/lib/dashboard/user-profile";

// FIXME: Copied from student page
// Iterate through courses, make a table of attendances wherein row = student, column = date
export default function Attendance() {
  const { token, user } = useAuth();

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
  const studentByCourse = studentData?.docs?.filter(
    // TODO: Make value = course.code
    (student) => value in student.courses.map((course) => course.value.code)
  );

  const dates = Array.from(
    // FIXME: Errors out when from is undefined
    { length: differenceInDays(date.to!, date.from!) },
    (_, i) => addDays(date.from!, i)
  );

  // TODO: memoize with useMemo
  // https://tanstack.com/table/latest/docs/guide/data#give-data-a-stable-reference
  // const columns: ColumnDef<{ date: Date }>[] = dates.map((date) => {
  //   return { accessorKey: date, header: date.getDate() } satisfies ColumnDef<{
  //     date: Date;
  //   }>;
  // });

  return (
    <main className="min-h-screen w-full p-4 pt-20 flex flex-col">
      <div className="flex flex-row justify-between items-center pb-4">
        <h1 className="text-left w-full">Attendance</h1>
      </div>
      {facultyIsLoading || facultyError ? (
        <div>
          <Spinner size="32" />
        </div>
      ) : (
        <div className="flex flex-col gap-3 overflow-y-auto">
          <div className="flex justify-between">
            {/* TODO: Make value = course object or course code for filtering*/}
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
          <div>content</div>
          {/* <DataTable columns={columns} data={studentFeeData!} /> */}
        </div>
      )}
    </main>
  );
}
