import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SpinnerProps {
  variant: SpinnerVariant;
}

const variantData: Record<SpinnerVariant, string> = {
  button: "w-5 h-5",
  page: "w-10 h-10 md:w-16 md:h-16",
};
export type SpinnerVariant = "button" | "page";

export default function Spinner({ variant }: SpinnerProps) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Loader2
        className={cn(["animate-spin aspect-square", variantData[variant]])}
        strokeWidth={1}
      />
    </div>
  );
}
