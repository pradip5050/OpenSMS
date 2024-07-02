"use client";

import { useAuth } from "@/components/AuthProvider";
import { Combobox } from "@/components/dashboard/Combobox";
import { DataTable } from "@/components/dashboard/DataTable";
import { ProgressDialog } from "@/components/dashboard/progresses/ProgressDialog";
import DeleteAlertDialog from "@/components/DeleteAlertDialog";
import GenericError from "@/components/GenericError";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { FacultyResponse, facultiesUrl } from "@/lib/dashboard/faculties";
import {
  Progress,
  progressesUrl,
  ProgressPayload,
  ProgressResponse,
} from "@/lib/dashboard/progresses";
import { StudentResponse, studentsUrl } from "@/lib/dashboard/students";
import { useFetchCollection, useMutateCollection } from "@/lib/hooks";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";

export default function FacultyCourses() {
  const { user, token } = useAuth();
  const {
    data: facultyData,
    isLoading: facultyIsLoading,
    error: facultyError,
  } = useFetchCollection<FacultyResponse>(facultiesUrl, token, {
    depth: 2,
    where: { "user.email": { equals: user!.email } },
  });
  const faculty = facultyData?.docs?.at(0);

  const {
    data: studentData,
    isLoading: studentIsLoading,
    error: studentError,
  } = useFetchCollection<StudentResponse>(
    () => (!!facultyData ? studentsUrl : null),
    token,
    {
      depth: 2,
      where: {
        "courses.code": {
          in: faculty?.courses.map((course) => course.code).toString(),
        },
      },
    }
  );
  const {
    data: progressData,
    isLoading: progressIsLoading,
    error: progressError,
  } = useFetchCollection<ProgressResponse>(
    () => (!!facultyData ? progressesUrl : null),
    token,
    {
      depth: 2,
      where: {
        "subject.code": {
          in: faculty?.subjects.map((subject) => subject.code).toString(),
        },
      },
    }
  );
  const {
    trigger: progressUpdateTrigger,
    isMutating: progressUpdateIsMutating,
  } = useMutateCollection<Progress, ProgressResponse, ProgressPayload>(
    progressesUrl,
    "PATCH"
  );
  const {
    trigger: progressDeleteTrigger,
    isMutating: progressDeleteIsMutating,
  } = useMutateCollection<Progress, ProgressResponse, ProgressPayload>(
    progressesUrl,
    "DELETE",
    (result, data) => {
      return {
        docs: data?.docs?.filter((progress) => progress.id !== result.id),
      };
    }
  );

  const students = studentData?.docs;
  const progresses = progressData?.docs;

  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  const filteredProgresses = progresses?.filter(
    (progress) => progress.student.id === value
  );
  const filteredPercents = filteredProgresses?.map(
    (progress) => progress.percent
  );

  const [percents, setPercents] = useState<number[] | undefined>(() =>
    filteredProgresses?.map((progress) => progress.percent)
  );
  useEffect(() => {
    if (progressData) {
      setPercents(
        progressData?.docs
          ?.filter((progress) => progress.student.id === value)
          ?.map((progress) => progress.percent)
      );
    }
  }, [progressData, value]);

  const studentsOptions = students?.map((val) => {
    return { value: val.id, label: val.user.name };
  });
  const subjectOptions = faculty?.subjects
    ?.filter(
      (val) =>
        !filteredProgresses
          ?.map((progress) => progress.subject.id)
          .some((id) => val.id === id)
    )
    .map((val) => {
      return { value: val.id, label: val.name };
    });

  async function onSubmit() {
    filteredProgresses?.forEach(async (progress, index) => {
      if (progress.percent === percents?.at(index)) {
        return;
      }

      await progressUpdateTrigger({
        token: token!,
        id: progress.id,
        payload: {
          percent: percents?.at(index),
          student: value,
          subject: progress.subject.id,
        },
      });
    });
  }

  // TODO: useMemo
  const columns: ColumnDef<Progress>[] = useMemo(
    () => [
      {
        accessorKey: "subject",
        header: "Subject",
        cell: ({ row }) => {
          return row.original.subject.name;
        },
      },
      {
        accessorKey: "percent",
        header: "Progress",
        cell: ({ row }) => {
          return (
            <div className="flex items-center">
              <span className="w-12">{percents?.at(row.index)}%</span>
              <Slider
                defaultValue={[0]}
                value={[percents?.at(row.index)!]}
                onValueChange={(value) => {
                  setPercents((percents) =>
                    percents?.with(row.index, value[0]!)
                  );
                }}
                max={100}
                step={1}
              />
            </div>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          return (
            <div className="flex justify-end">
              <DeleteAlertDialog
                onClick={async () => {
                  await progressDeleteTrigger({
                    token: token!,
                    id: row.original.id,
                    payload: {},
                  });
                }}
                variant={{ type: "icon", disabled: progressDeleteIsMutating }}
              />
            </div>
          );
        },
      },
    ],
    [percents]
  );

  const isLoading = facultyIsLoading || studentIsLoading || progressIsLoading;
  const isError = !!facultyError || !!studentError || !!progressError;

  if (isLoading) {
    return <Spinner variant="page" />;
  }

  if (isError) {
    return <GenericError variant="error" />;
  }

  /*TODO: Better still, move this to parallel route layout */
  if (user?.roles === "admin") {
    return <GenericError variant="notImpl" />;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Combobox
          options={studentsOptions!}
          label="student"
          state={{ value: value, setValue: setValue }}
        />
        <div className="space-x-2">
          {value !== "" && filteredProgresses?.length !== 0 && (
            <Button disabled={progressUpdateIsMutating} onClick={onSubmit}>
              {progressUpdateIsMutating ? (
                <Spinner variant="button" />
              ) : (
                "Update"
              )}
            </Button>
          )}
          {value !== "" && subjectOptions!.length !== 0 && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>New</Button>
              </DialogTrigger>
              <ProgressDialog
                setOpen={setOpen}
                student={value}
                subjectOptions={subjectOptions!}
              />
            </Dialog>
          )}
        </div>
      </div>
      <DataTable columns={columns} data={filteredProgresses!} />
    </div>
  );
}
