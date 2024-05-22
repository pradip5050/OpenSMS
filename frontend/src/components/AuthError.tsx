import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AuthError() {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl">Error!</h1>
      <h2 className="text-3xl py-5">Not Authenticated</h2>
      <Button onClick={() => router.push("/")} className="mt-3">
        Back to Login
      </Button>
    </div>
  );
}
