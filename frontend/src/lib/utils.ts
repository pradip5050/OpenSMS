import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import { type ClassValue, clsx } from "clsx";
import { Key, KeyedMutator } from "swr";
import { TriggerWithArgs } from "swr/dist/mutation";
import { twMerge } from "tailwind-merge";

export interface GetResponse<T> {
  data: T | undefined;
  error: AxiosError | undefined;
  isLoading: boolean;
  isValidating: boolean;
  mutate: KeyedMutator<T>;
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

export function destructiveToast(
  toast: any,
  title: string,
  description: string
) {
  return () =>
    toast({
      title,
      description,
      variant: "destructive",
      duration: 1000,
    });
}

export function constructiveToast(
  toast: any,
  title: string,
  description: string
) {
  return () =>
    toast({
      title,
      description,
      variant: "constructive",
      duration: 1000,
    });
}
