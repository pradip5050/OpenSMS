import axios, { AxiosError, AxiosResponse } from "axios";
import { GetResponse, Relation } from "../utils";
import { Course } from "./courses";
import { Student } from "./user-profile";
import useSWR from "swr";
import { API_URL } from "../constants";

export interface Attendance {
  id: string;
  date: string;
  isPresent: boolean;
  course: Relation<Course>;
  student: Relation<Student>;
}
export interface AttendanceResponse {
  docs?: Attendance[];
}

export function useAttendances(
  token?: string
): GetResponse<AttendanceResponse | undefined> {
  const { data, error, isLoading } = useSWR<AttendanceResponse, AxiosError>(
    `${API_URL}/api/attendances?draft=false&depth=2`,
    (url: string) =>
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res: AxiosResponse<AttendanceResponse>) => res.data)
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
  } satisfies GetResponse<AttendanceResponse | undefined>;
}
