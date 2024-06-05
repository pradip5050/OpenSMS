import axios from "axios";
import useSWRMutation from "swr/mutation";
import { API_URL } from "../constants";
import { Dispatch } from "react";
import { AuthAction, AuthActionKind } from "@/components/AuthProvider";

export interface User {
  id: string;
  roles: "admin" | "faculty" | "student";
  name: string;
  email: string;
  loginAttempts: number;
}
export interface UserRelation {
  relationTo: string;
  value: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

const fetcher = (url: string, { arg }: { arg: LoginPayload }) =>
  axios
    .post(url, JSON.stringify(arg), {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => res.data);

export function useLogin() {
  const { trigger, isMutating } = useSWRMutation(
    `${API_URL}/api/users/login`,
    fetcher
  );

  return {
    trigger: trigger,
    isMutating: isMutating,
  };
}

export function login(
  token: string,
  user: User,
  dispatch: Dispatch<AuthAction>
) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  dispatch({ type: AuthActionKind.Login, token: token, user: user });
}

export function logout(dispatch: Dispatch<AuthAction>) {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  dispatch({ type: AuthActionKind.Logout });
}
