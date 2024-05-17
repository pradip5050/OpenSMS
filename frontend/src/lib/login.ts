import axios, { AxiosError } from "axios";
import { API_URL } from "./constants";
import useSWR, { Fetcher } from "swr";

export interface Response<T> {
  data: T;
  error: AxiosError | undefined;
  isLoading: boolean;
}

export interface Logo {
  id: number;
  logo: {
    alt: string;
    url: string;
  };
}

const fetcher: Fetcher<Logo> = (url: string) =>
  axios.get(url).then((res) => res.data);

export async function signIn(name: string, password: string) {}

export function useLogo() {
  const { data, error, isLoading } = useSWR<Logo>(
    `${API_URL}/api/globals/loginlogo?locale=undefined&draft=false&depth=1`,
    fetcher
  );

  return {
    data,
    error,
    isLoading,
  } satisfies Response<Logo | undefined>;

  // return `${API_URL}${data.logo.url}`;
  // return "f";
}
