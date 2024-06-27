import { ArrowUpDown } from "lucide-react";
import { Button } from "./ui/button";
import { Column } from "@tanstack/react-table";

export interface SortButtonProps<T> {
  title: string;
  column: Column<T, unknown>;
}

export default function SortButton<T>({ title, column }: SortButtonProps<T>) {
  return (
    <div className="flex items-center gap-1">
      {title}
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    </div>
  );
}
