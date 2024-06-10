import axios, { AxiosError, AxiosResponse } from "axios";
import useSWR, { Key } from "swr";
import qs from "qs";
import { GetResponse } from "./utils";

export function useGetCollection<T>( // T is of type XYZResponse
  url: Key | string,
  token?: string,
  transformer?: (data?: T) => T | undefined,
  query?: Record<string, any>
): GetResponse<T> {
  const stringifiedQuery = query
    ? qs.stringify(
        {
          where: {
            query,
          },
        },
        { addQueryPrefix: true }
      )
    : undefined;

  const { data, error, isLoading, isValidating, mutate } = useSWR<
    T,
    AxiosError
  >(url, (url: string) =>
    axios
      .get(`${url}${stringifiedQuery ?? ""}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res: AxiosResponse<T>) => res.data)
  );

  return {
    data: transformer ? transformer(data) : data,
    error,
    isLoading,
    isValidating,
    mutate,
  } satisfies GetResponse<T>;
}
