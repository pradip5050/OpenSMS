import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export interface GenericErrorPayload {
  title?: string;
  description?: string;
}

export default function GenericError({
  title,
  description,
}: GenericErrorPayload) {
  const router = useRouter();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background px-4 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
          {title ?? "Oops, something went wrong"}
        </h1>
        <p className="text-muted-foreground">
          {description ??
            "We encountered an issue while trying to load the page. Please try refreshing the page."}
        </p>
        <Button
          onClick={() => router.refresh()}
          className="w-full max-w-[200px]"
        >
          Reload Page
        </Button>
      </div>
    </div>
  );
}
