import axios, { AxiosError, AxiosResponse } from "axios";
import useSWR from "swr";
import { API_URL } from "../constants";
import { GetResponse } from "../utils";
import { StudentRelation } from "./user-profile";

export interface Fee {
  id: number;
  description: string;
  amount: number;
  dueDate: string;
  paymentStatus: "unpaid" | "paid" | "delayed";
  student: StudentRelation;
}

export interface FeeResponse {
  docs: Fee[];
}

export function useFees(token?: string) {
  const { data, error, isLoading } = useSWR<FeeResponse, AxiosError>(
    `${API_URL}/api/fees?draft=false&depth=1`,
    (url: string) =>
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res: AxiosResponse<FeeResponse>) => res.data)
  );

  // TODO: Check whether data mapping can be done here
  return {
    data,
    error,
    isLoading,
  } satisfies GetResponse<FeeResponse | undefined>;
}
