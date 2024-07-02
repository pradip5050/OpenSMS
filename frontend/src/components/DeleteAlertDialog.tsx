import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Trash2 } from "lucide-react";

export interface DeleteAlertDialogProps {
  onClick: () => void;
  variant:
    | {
        type: "icon";
        disabled: boolean;
      }
    | {
        type: "dropdownMenuItem";
        disabled: boolean;
      };
}

export default function DeleteAlertDialog({
  onClick,
  variant,
}: DeleteAlertDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        {variant.type === "icon" && (
          <Button
            variant={"destructive"}
            disabled={variant.disabled}
            size={"icon"}
          >
            <Trash2 />
          </Button>
        )}
        {variant.type === "dropdownMenuItem" && (
          <DropdownMenuItem
            className="bg-destructive"
            disabled={variant.disabled}
            onClick={onClick}
          >
            Delete
          </DropdownMenuItem>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            onClick={onClick}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
