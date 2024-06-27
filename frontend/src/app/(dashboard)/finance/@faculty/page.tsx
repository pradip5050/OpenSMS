"use client";

import { useAuth } from "@/components/AuthProvider";
import { DataTable } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import {
  FeePayload,
  FeeResponse,
  feesUrl,
  feeTransformer,
} from "@/lib/dashboard/finance";
import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Fee } from "@/lib/dashboard/finance";
import Spinner from "@/components/Spinner";
import { Combobox } from "@/components/dashboard/Combobox";
import React from "react";
import { FeeDialog } from "@/components/dashboard/finance/FeeDialog";
import { StudentResponse, studentsUrl } from "@/lib/dashboard/students";
import { useFetchCollection, useMutateCollection } from "@/lib/hooks";
import { useToast } from "@/components/ui/use-toast";
import { constructiveToast, destructiveToast } from "@/lib/utils";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import GenericError from "@/components/GenericError";

export default function Finance() {
  const { token } = useAuth();
  const {
    data: feeData,
    error: feeError,
    isLoading: feeIsLoading,
  } = useFetchCollection<FeeResponse>(
    feesUrl,
    token,
    {
      depth: 2,
      draft: false,
    },
    feeTransformer
  );
  const {
    trigger: deleteFeeTrigger,
    isMutating: deleteFeeIsMutating,
    error: deleteFeeError,
  } = useMutateCollection<Fee, FeeResponse, FeePayload>(
    feesUrl,
    "DELETE",
    (result, data) => {
      return { docs: data!.docs!.filter((val) => val.id !== result.id) };
    }
  );
  const {
    trigger: updateFeeTrigger,
    isMutating: updateFeeIsMutating,
    error: updateFeeError,
  } = useMutateCollection<Fee, FeeResponse, FeePayload>(
    feesUrl,
    "PATCH",
    (result, data) => {
      console.log(result);
      return {
        docs: [...data!.docs!.filter((val) => val.id !== result.id), result],
      };
    }
  );

  const {
    data: studentData,
    error: studentError,
    isLoading: studentIsLoading,
  } = useFetchCollection<StudentResponse>(studentsUrl, token, {
    depth: 2,
    draft: false,
  });

  const [value, setValue] = React.useState("");
  const { toast } = useToast();

  // TODO: useMemo
  const columns: ColumnDef<Fee>[] = [
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Due date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      sortingFn: (rowA, rowB, columnId) => {
        return rowA.original.dueDate > rowB.original.dueDate
          ? 1
          : rowA.original.dueDate < rowB.original.dueDate
            ? -1
            : 0;
      },
      cell: ({ row }) => {
        return row.original.dueDate.toDateString();
      },
    },
    { accessorKey: "paymentStatus", header: "Payment status" },
    {
      id: "actions",
      cell: ({ row }) => {
        const fee = row.original;

        return (
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DialogTrigger asChild>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuItem
                  className="bg-destructive"
                  disabled={isMutating}
                  onClick={async () => {
                    await deleteFeeTrigger({
                      token: token!,
                      id: fee.id,
                      payload: {},
                    });

                    if (deleteFeeError) {
                      destructiveToast(
                        toast,
                        "Error",
                        "Failed to delete fee"
                      )();
                    } else {
                      constructiveToast(toast, "Success", "Deleted fee")();
                    }
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <FeeDialog
              id={fee.id}
              student={selectedStudent}
              description={fee.description}
              amount={fee.amount}
              dueDate={fee.dueDate}
              paymentStatus={fee.paymentStatus}
            />
          </Dialog>
        );
      },
    },
  ];

  const students = studentData?.docs;
  const studentsOptions = students?.map((val) => {
    return { value: val.id, label: val.user.name };
  });
  const selectedStudent = students?.filter((val) => val.id === value)[0];

  const studentFeeData = feeData?.docs?.filter(
    (val) => val.student.value.id === value
  );

  const isLoading = feeIsLoading || studentIsLoading;
  const isError = !!feeError || !!studentError;
  const isMutating = deleteFeeIsMutating || updateFeeIsMutating;

  if (isLoading) {
    return <Spinner size="32" />;
  }

  if (isError) {
    return <GenericError variant="error" />;
  }

  return (
    <div className="flex flex-col gap-3 overflow-y-auto">
      <div className="flex justify-between">
        <Combobox
          options={studentsOptions!}
          label="student"
          state={{ value: value, setValue: setValue }}
        />
        {value != "" && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add new</Button>
            </DialogTrigger>
            <FeeDialog student={selectedStudent} />
          </Dialog>
        )}
      </div>
      <DataTable columns={columns} data={studentFeeData!} />
    </div>
  );
}
