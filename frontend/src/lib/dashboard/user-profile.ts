import axios, { AxiosError, AxiosResponse } from "axios";
import { API_URL } from "../constants";
import useSWR, { Fetcher } from "swr";
import { GetResponse, Relation } from "../utils";
import qs from "qs";
import { Course } from "./courses";
import { User } from "../login/login";

export interface Student {
  id: string;
  studentId: number;
  number: number;
  dob: string;
  courses: Relation<Course>[];
  user: Relation<User>;
  photo: {
    alt: string;
    url: string;
  };
}

export interface StudentResponse {
  docs?: Student[];
}

export const studentsUrl = `${API_URL}/api/students`;

export function studentTransformer(
  data?: StudentResponse
): StudentResponse | undefined {
  return {
    docs: data?.docs!.map((student) => {
      const dob = new Date(`${student.dob}`);

      return {
        ...student,
        photo: {
          ...student.photo,
          url: `${API_URL}${student.photo.url}`,
        },
        dob: dob.toDateString(),
      };
    }),
  };
}

const fetcher: Fetcher<StudentResponse> = (url: string) =>
  axios.get(url).then((res) => res.data);

export function useStudents(token?: string): GetResponse<StudentResponse> {
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    StudentResponse,
    AxiosError
  >(`${API_URL}/api/students?draft=false&depth=2`, (url: string) =>
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res: AxiosResponse<StudentResponse>) => res.data)
  );

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  } satisfies GetResponse<StudentResponse>;
}

export function useStudentByEmail(email: string) {
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

  const { data, error, isLoading, isValidating, mutate } =
    useSWR<StudentResponse>(`${API_URL}/api/students${query}`, fetcher);

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  } satisfies GetResponse<StudentResponse>;
}

export function mapStudent(student: Student | undefined): Student | undefined {
  if (student) {
    const dob = new Date(`${student.dob}`);

    return {
      ...student,
      photo: {
        ...student.photo,
        url: `${API_URL}${student.photo.url}`,
      },
      dob: dob.toDateString(),
    };
  }
}
