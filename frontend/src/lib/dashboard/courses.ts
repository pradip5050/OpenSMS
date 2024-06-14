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
