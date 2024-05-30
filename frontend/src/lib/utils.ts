import { AxiosError } from "axios";
import { type ClassValue, clsx } from "clsx";
import { TriggerWithArgs } from "swr/dist/mutation";
import { twMerge } from "tailwind-merge";

export interface GetResponse<T> {
  data: T;
  error: AxiosError | undefined;
  isLoading: boolean;
}

export interface PostResponse<T> {
  trigger: TriggerWithArgs<any, any, string, AuthPayload<T>>;
  isMutating: boolean;
}

export interface AuthPayload<T> {
  token: string;
  payload: T;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
