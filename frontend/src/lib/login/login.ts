import axios from "axios";
import { Fetcher } from "swr";
import useSWRMutation, { MutationFetcher } from "swr/mutation";
import { GetResponse } from "../utils";
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
    `${API_URL}/api/users/login`,
    fetcher
  );

  return {
    trigger: trigger,
    isMutating: isMutating,
  };
}

export function login(token: string, dispatch: Dispatch<AuthAction>) {
  localStorage.setItem("token", token);
  dispatch({ type: AuthActionKind.Login, token: token });
}

export function logout(dispatch: Dispatch<AuthAction>) {
  localStorage.removeItem("token");
  dispatch({ type: AuthActionKind.Logout, token: null });
}
