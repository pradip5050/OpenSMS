import axios from "axios";
import { API_URL } from "../constants";
import useSWR, { Fetcher } from "swr";
import { GetResponse } from "../utils";
import qs from "qs";

// TODO: Change interface and check query
export interface Student {
  id: number;
  image: {
    alt: string;
    url: string;
  };
}

const fetcher: Fetcher<Student> = (url: string) =>
  axios.get(url).then((res) => res.data);

export function useStudent(email: string) {
  const query = qs.stringify(
    {
      where: {
        "user.value.email": {
          equals: email,
        },
      },
    },
    { addQueryPrefix: true }
  );

  const { data, error, isLoading } = useSWR<Student>(
    `${API_URL}/api/students${query}`,
    fetcher
  );

  return {
    data,
    error,
    isLoading,
  } satisfies GetResponse<Student | undefined>;
}
