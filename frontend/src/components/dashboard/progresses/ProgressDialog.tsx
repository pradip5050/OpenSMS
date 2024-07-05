import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { useMutateCollection } from "@/lib/hooks";
import { useAuth } from "@/components/AuthProvider";
import { Combobox } from "../Combobox";
import {
  Progress,
  progressesUrl,
  ProgressPayload,
  ProgressResponse,
} from "@/lib/dashboard/progresses";
import { Slider } from "@/components/ui/slider";
import Spinner from "@/components/Spinner";
import { constructiveToast, destructiveToast } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

export interface ProgressDialogProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  subjectOptions: { value: string; label: string }[];
  student: string;
}

export function ProgressDialog({
  setOpen,
  student,
  subjectOptions,
}: ProgressDialogProps) {
  const { token } = useAuth();
  const { toast } = useToast();
  const [subjectValue, setSubjectValue] = useState("");
  const [percent, setPercent] = useState([0]);

  const {
    trigger: progressCreateTrigger,
    isMutating: progressCreateIsMutating,
    error: progressCreateError,
  } = useMutateCollection<{ doc: Progress }, ProgressResponse, ProgressPayload>(
    progressesUrl,
    "POST",
    (result, data) => {
      return {
        docs: [...data!.docs!, result.doc],
      };
    }
  );

  async function onSubmit() {
    if (subjectValue === "") {
      return;
    }

    await progressCreateTrigger({
      token: token!,
      payload: {
        percent: percent[0],
        student: student,
        subject: subjectValue,
      },
    });

    if (progressCreateError) {
      destructiveToast(toast, "Error", "Failed to update grade")();
    } else {
      constructiveToast(toast, "Success", "Updated grade")();
    }

    setOpen(false);
  }

  const isMutating = progressCreateIsMutating;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add progress</DialogTitle>
      </DialogHeader>
      <div className="flex  justify-center">
        <Combobox
          options={subjectOptions}
          label="subject"
          state={{ value: subjectValue, setValue: setSubjectValue }}
        />
      </div>
      <div className="flex space-x-2">
        <span>{percent}%</span>
        <Slider
          value={percent}
          onValueChange={(val) => {
            setPercent(val);
          }}
          max={100}
          step={1}
        />
      </div>
      <Button disabled={isMutating} onClick={onSubmit}>
        {isMutating ? <Spinner variant="button" /> : "Submit"}
      </Button>
    </DialogContent>
  );
}
