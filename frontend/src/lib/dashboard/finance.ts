import axios, { AxiosError, AxiosResponse } from "axios";
import useSWR from "swr";
import { API_URL } from "../constants";
import { GetResponse } from "../utils";
import { StudentRelation } from "./user-profile";

export interface Fee {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  paymentStatus: "unpaid" | "paid" | "delayed";
  student: StudentRelation;
}

// TODO: Find a way to make docs not undefined for mapping
export interface FeeResponse {
  docs?: Fee[];
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

  const transformedData: FeeResponse | undefined = {
    docs: data?.docs?.map((fee) => {
      return { ...fee, dueDate: new Date(fee.dueDate).toDateString() };
    }),
  };

  return {
    data: transformedData,
    error,
    isLoading,
  } satisfies GetResponse<FeeResponse | undefined>;
}
