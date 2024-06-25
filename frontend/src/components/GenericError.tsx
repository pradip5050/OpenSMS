import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface VariantBody {
  title?: string;
  desc?: string;
}
type Variant = "error" | "noData";

const variants: Record<Variant, VariantBody> = {
  error: {
    title: "Oops, something went wrong",
    desc: "We encountered an issue while trying to load the page. Please try refreshing the page.",
  },
  noData: {
    desc: "Check back soon for updates.",
  },
};

export interface GenericErrorPayload {
  title?: string;
  description?: string;
  variant: Variant;
  showDesc?: boolean;
  showRefreshButton?: boolean;
}

export default function GenericError({
  variant,
  title,
  description,
  showDesc = true,
  showRefreshButton = true,
}: GenericErrorPayload) {
  const router = useRouter();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background px-4 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
          {title ?? variants[variant].title!}
        </h1>
        {showDesc && (
          <p className="text-muted-foreground">
            {description ?? variants[variant].desc!}
          </p>
        )}
        {showRefreshButton && (
          <Button
            onClick={() => router.refresh()}
            className="w-full max-w-[200px]"
          >
            Reload Page
          </Button>
        )}
      </div>
    </div>
  );
}
