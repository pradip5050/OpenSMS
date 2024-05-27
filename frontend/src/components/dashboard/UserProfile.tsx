"use client";

import * as React from "react";
import { User2 } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/login/login";
import { useAuth, useAuthDispatch } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const dispatch = useAuthDispatch();
  const router = useRouter();
  const { token, loading } = useAuth();

  if (token && !loading)
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <User2 className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all " />
            <span className="sr-only">User profile</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push("user-profile")}>
            Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              logout(dispatch);
              router.push("/");
            }}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
}
