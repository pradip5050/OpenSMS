import { AxiosError } from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface GetResponse<T> {
  data: T;
  error: AxiosError | undefined;
  isLoading: boolean;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
