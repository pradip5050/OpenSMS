"use client";

import AuthError from "@/components/AuthError";
import { AuthProvider, useAuth } from "@/components/AuthProvider";

export default function Template({ children }: { children: React.ReactNode }) {
  const state = useAuth();

  return state.token ? children : <AuthError />;
}
