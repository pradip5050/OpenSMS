import { API_URL } from "../constants";
import { User } from "../login/login";
import { Relation } from "../utils";
import { Course } from "./courses";

export interface Faculty {
  id: string;
  facultyId: number;
  number: number;
  dob: string;
  courses: Relation<Course>[];
  user: Relation<User>;
  photo: {
    alt: string;
    url: string;
  };
}
export interface FacultyResponse {
  docs?: Faculty[];
}
export const facultyUrl = `${API_URL}/api/faculties?draft=false&depth=2`;
// TODO: Remove ?draft... from url

export function facultyTransformer(
  data?: FacultyResponse
): FacultyResponse | undefined {
  if (data) {
    return {
      docs: data.docs?.map((faculty) => {
        const dob = new Date(`${faculty.dob}`);

        return {
          ...faculty,
          photo: {
            ...faculty.photo,
            url: `${API_URL}${faculty.photo.url}`,
          },
          dob: dob.toDateString(),
        };
      }),
    };
  }
}
