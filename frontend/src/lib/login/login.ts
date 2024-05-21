import axios from "axios";
import { Fetcher } from "swr";
import useSWRMutation, { MutationFetcher } from "swr/mutation";
import { GetResponse } from "../utils";
import { API_URL } from "../constants";

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

  //   trigger(payload);

  return {
    trigger: trigger,
    isMutating: isMutating,
  };
}
