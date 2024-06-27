"use client";

import { useAuth } from "@/components/AuthProvider";
import GenericError from "@/components/GenericError";
import Spinner from "@/components/Spinner";

export default function Template({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  if (auth.loading) {
    return (
      <div className="flex w-full items-center justify-center">
        <Spinner variant="page" />
      </div>
    );
  }

  if (auth.token) {
    return children;
  } else {
    return <GenericError variant="auth" />;
  }
}
