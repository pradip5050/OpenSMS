import { API_URL } from "../constants";
import { Subject } from "./subjects";

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  duration: number;
  subjects: Subject[];
}
export interface CourseResponse {
  docs?: Course[];
}

export const coursesUrl = `${API_URL}/api/courses`;
