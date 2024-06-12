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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Fee } from "@/lib/dashboard/finance";
import Spinner from "@/components/Spinner";
import { Combobox } from "@/components/dashboard/Combobox";
import React from "react";
import { AddFeeDialog } from "@/components/dashboard/finance/AddFeeDialog";
import { StudentResponse, studentsUrl } from "@/lib/dashboard/user-profile";
import { useFetchCollection, useMutateCollection } from "@/lib/hooks";

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
    trigger: deleteTrigger,
    isMutating: deleteIsMutating,
    error: deleteError,
  } = useMutateCollection<Fee, FeeResponse, FeePayload>(feesUrl, "POST");

  const {
    data: studentData,
    error: studentError,
    isLoading: studentIsLoading,
  } = useFetchCollection<StudentResponse>(studentsUrl, token, {
    depth: 2,
    draft: false,
  });

  const [value, setValue] = React.useState("");

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
        const payment = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  const result = deleteTrigger({
                    token: token!,
                    payload: {
                      description: "",
                    },
                  });
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(payment.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const students = studentData?.docs;
  const studentsOptions = students?.map((val) => {
    return { value: val.id, label: val.user.value.name };
  });

  const studentFeeData = feeData?.docs?.filter(
    (val) => val.student.value.id === value
  );

  return (
    <main className="min-h-screen w-full p-4 pt-20 flex flex-col max-h-screen">
      <div className="flex flex-row justify-between items-center pb-4">
        <h1 className="text-left w-full">Finance</h1>
      </div>
      {/* TODO: Handle error */}
      {feeIsLoading || feeError || studentIsLoading || studentError ? (
        <Spinner size="32" />
      ) : (
        <div className="flex flex-col gap-3 overflow-y-auto">
          <div className="flex justify-between">
            <Combobox
              options={studentsOptions!}
              label="student"
              state={{ value: value, setValue: setValue }}
            />
            {value !== "" && (
              <AddFeeDialog
                student={students?.filter((val) => val.id === value)[0]}
              />
            )}
          </div>
          <DataTable columns={columns} data={studentFeeData!} />
        </div>
      )}
    </main>
  );
}
