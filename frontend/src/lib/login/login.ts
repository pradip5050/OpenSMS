import axios from "axios";
import useSWRMutation from "swr/mutation";
import { API_URL } from "../constants";
import { Dispatch } from "react";
import { AuthAction, AuthActionKind } from "@/components/AuthProvider";

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
    // `http://10.0.2.2:3002/api/users/login`,
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
  roles: string,
  dispatch: Dispatch<AuthAction>
) {
  localStorage.setItem("token", token);
  localStorage.setItem("roles", roles);
  dispatch({ type: AuthActionKind.Login, token: token, roles: roles });
}

export function logout(dispatch: Dispatch<AuthAction>) {
  localStorage.removeItem("token");
  localStorage.removeItem("roles");
  dispatch({ type: AuthActionKind.Logout, token: null, roles: null });
}
