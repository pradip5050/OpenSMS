import axios, { AxiosError, AxiosResponse } from "axios";
import { GetResponse } from "../utils";
import useSWR from "swr";
import { API_URL } from "../constants";

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
}
export interface CourseResponse {
  docs?: Course[];
}

export const coursesUrl = `${API_URL}/api/courses`;

export function useCourses(token?: string): GetResponse<CourseResponse> {
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    CourseResponse,
    AxiosError
  >(`${API_URL}/api/courses?draft=false&depth=2`, (url: string) =>
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res: AxiosResponse<CourseResponse>) => res.data)
  );

  //   const transformedData: AttendanceResponse | undefined = {
  //     docs: data?.docs?.map((fee) => {
  //       return { ...fee, date: new Date(fee.date) };
  //     }),
  //   };

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  } satisfies GetResponse<CourseResponse>;
}
