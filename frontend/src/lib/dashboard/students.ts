import { API_URL } from "../constants";
import { Course } from "./courses";
import { User } from "../login/login";

export interface Student {
  id: string;
  studentId: number;
  number: number;
  dob: string;
  links: { title: string; url: string; description: string }[];
  courses: Course[];
  user: User;
  photo: {
    alt?: string;
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
