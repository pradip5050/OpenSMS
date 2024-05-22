import { cn } from "@/lib/utils";

interface SpinnerProps {
  width: string;
  height: string;
}

// TODO: Use Loader2 from lucide instead

export default function Spinner({ width, height }: SpinnerProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin", "")} // Add additional classes in ""
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
