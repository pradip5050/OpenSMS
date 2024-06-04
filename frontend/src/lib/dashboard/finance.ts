import axios, { Axios, AxiosError, AxiosResponse } from "axios";
import useSWR, { Key } from "swr";
import { API_URL } from "../constants";
import { AuthPayload, GetResponse, PostResponse } from "../utils";
import { StudentRelation } from "./user-profile";
import useSWRMutation from "swr/mutation";

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

export function useFees(token?: string): GetResponse<FeeResponse | undefined> {
  const { data, error, isLoading } = useSWR<FeeResponse, AxiosError>(
    `${API_URL}/api/fees?draft=false&depth=2`,
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

export interface Order {
  amount: number;
  amountDue: number;
  amountPaid: number;
  attempts: number;
  createdAt: string;
  currency: string;
  entity: string;
  id: string;
  notes: string[];
  offerId?: string;
  receipt?: string;
  status: string;
}
interface OrderResponse extends Order {
  amount_due: number;
  amount_paid: number;
  created_at: string;
  offer_id?: string;
}

const postFetcher = (url: string, { arg }: { arg: AuthPayload<string> }) =>
  axios
    .post(url, JSON.stringify(arg.payload), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${arg.token}`,
      },
    })
    .then((res: AxiosResponse<OrderResponse>) => res.data);

export function useOrder(amount: number) {
  const { data, trigger, isMutating, error } = useSWRMutation<
    OrderResponse,
    AxiosError,
    Key,
    any,
    any
  >(`${API_URL}/api/fees/order/create/${amount}`, postFetcher);
  // TODO: Consider returning a callback fn instead of using Partial
  const transformedData: Partial<OrderResponse> | undefined = {
    ...data,
    amountDue: data?.["amount_due"],
    amountPaid: data?.["amount_paid"],
    createdAt: data?.["created_at"],
    offerId: data?.["offer_id"],
  };

  return {
    data: transformedData,
    error,
    trigger,
    isMutating,
  } satisfies PostResponse<Partial<OrderResponse>, AxiosError>;
}
