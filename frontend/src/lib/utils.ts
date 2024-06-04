import { AxiosError } from "axios";
import { type ClassValue, clsx } from "clsx";
import { Key } from "swr";
import { TriggerWithArgs } from "swr/dist/mutation";
import { twMerge } from "tailwind-merge";

export interface GetResponse<T> {
  data: T;
  error: AxiosError | undefined;
  isLoading: boolean;
}

export interface PostResponse<T, E> {
  data?: T;
  error?: E;
  trigger: any;
  isMutating: boolean;
}

export interface AuthPayload<T> {
  token: string;
  payload: T;
}

export interface Relation<T> {
  relationTo: string;
  value: T;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
