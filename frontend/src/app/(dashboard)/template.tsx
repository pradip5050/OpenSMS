"use client";

import AuthError from "@/components/AuthError";
import { AuthProvider, AuthState, useAuth } from "@/components/AuthProvider";
import Spinner from "@/components/Spinner";
import { useEffect, useState } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  if (auth.loading) {
    return (
      <div className="flex w-full items-center justify-center">
        <Spinner size="50" />
      </div>
    );
  }

  if (auth.token) {
    return children;
  } else {
    return <AuthError />;
  }
}
