"use client";

import AuthError from "@/components/AuthError";
import { AuthProvider, AuthState, useAuth } from "@/components/AuthProvider";
import Spinner from "@/components/Spinner";
import { useEffect, useState } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  if (auth.loading) {
    return <Spinner width="100" height="100" />;
  }

  if (auth.token) {
    return children;
  } else {
    return <AuthError />;
  }
}
