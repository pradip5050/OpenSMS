import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface VariantBody {
  title?: string;
  desc?: string;
  buttonAction?: ErrorButtonAction;
}
type Variant = "error" | "noData" | "auth";

const variants: Record<Variant, VariantBody> = {
  error: {
    title: "Oops, something went wrong",
    desc: "We encountered an issue while trying to load the page. Please try refreshing the page.",
    buttonAction: { action: "refresh", label: "Reload page" },
  },
  noData: {
    desc: "Check back soon for updates.",
    buttonAction: { action: "refresh", label: "Reload page" },
  },
  auth: {
    title: "Not authorized",
    desc: "You are not authorized to access this page.",
    buttonAction: { action: "redirect", url: "/", label: "Back to login" },
  },
};

export type ErrorButtonAction =
  | {
      action: "refresh";
      label: string;
    }
  | {
      action: "redirect";
      url: string;
      label: string;
    };

export interface GenericErrorPayload {
  title?: string;
  description?: string;
  variant: Variant;
  showDesc?: boolean;
  showRefreshButton?: boolean;
  buttonAction?: ErrorButtonAction;
}

export default function GenericError({
  variant,
  title,
  description,
  showDesc = true,
  showRefreshButton = true,
}: GenericErrorPayload) {
  const router = useRouter();

  function onButtonClick(buttonAction: ErrorButtonAction) {
    switch (buttonAction.action) {
      case "refresh": {
        router.refresh();
        break;
      }
      case "redirect": {
        router.push(buttonAction.url);
        break;
      }
    }
  }

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
            onClick={() => onButtonClick(variants[variant].buttonAction!)}
            className="w-full max-w-[200px]"
          >
            {variants[variant].buttonAction!.label}
          </Button>
        )}
      </div>
    </div>
  );
}
