import { Loader2 } from "lucide-react";

interface SpinnerProps {
  size: string;
}

export default function Spinner({ size }: SpinnerProps) {
  return <Loader2 className="animate-spin" size={size} strokeWidth={1} />;
}
