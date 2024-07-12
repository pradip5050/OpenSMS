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
import { useToast } from "@/components/ui/use-toast";
import {
  Progress,
  progressesUrl,
  ProgressPayload,
  ProgressResponse,
} from "@/lib/dashboard/progresses";
import { StudentResponse, studentsUrl } from "@/lib/dashboard/students";
import { useFetchCollection, useMutateCollection } from "@/lib/hooks";
import { constructiveToast, destructiveToast } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";

export default function FacultyCourses() {
  const { token } = useAuth();
  const { toast } = useToast();

  const {
    data: studentData,
    isLoading: studentIsLoading,
    error: studentError,
  } = useFetchCollection<StudentResponse>(studentsUrl, token, {
    depth: 2,
  });

  const {
    data: progressData,
    isLoading: progressIsLoading,
    error: progressError,
  } = useFetchCollection<ProgressResponse>(progressesUrl, token, {
    depth: 2,
  });
  const {
    trigger: progressUpdateTrigger,
    isMutating: progressUpdateIsMutating,
    error: progressUpdateError,
  } = useMutateCollection<Progress, ProgressResponse, ProgressPayload>(
    progressesUrl,
    "PATCH"
  );
  const {
    trigger: progressDeleteTrigger,
    isMutating: progressDeleteIsMutating,
    error: progressDeleteError,
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

  const student = students?.filter((val) => val.id === value).at(0);
  const filteredProgresses = progresses?.filter(
    (progress) => progress.student.id === value
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
  const subjects = student?.courses
    .map((val) => val.subjects.map((val) => val))
    .flat();
  const subjectOptions = student?.courses
    .map((val) =>
      val.subjects.map((val) => {
        return { value: val.id, label: val.name };
      })
    )
    .flat();

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

      if (progressUpdateError) {
        destructiveToast(toast, "Error", "Failed to update progress")();
      } else {
        constructiveToast(toast, "Success", "Updated progress")();
      }
    });
  }

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

                  if (progressDeleteError) {
                    destructiveToast(
                      toast,
                      "Error",
                      "Failed to delete progress"
                    )();
                  } else {
                    constructiveToast(toast, "Success", "Deleted progress")();
                  }
                }}
                variant={{ type: "icon", disabled: progressDeleteIsMutating }}
              />
            </div>
          );
        },
      },
    ],
    [
      percents,
      token,
      progressDeleteIsMutating,
      progressDeleteTrigger,
      toast,
      progressDeleteError,
    ]
  );

  const isLoading = studentIsLoading || progressIsLoading;
  const isError = !!studentError || !!progressError;

  if (isLoading) {
    return <Spinner variant="page" />;
  }

  if (isError) {
    return <GenericError variant="error" />;
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
