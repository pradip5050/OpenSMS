"use client";

import GenericError from "@/components/GenericError";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <GenericError variant={"error"} />
      </body>
    </html>
  );
}
