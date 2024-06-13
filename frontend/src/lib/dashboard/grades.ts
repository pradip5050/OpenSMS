import { API_URL } from "../constants";
import { Relation } from "../utils";
import { Course } from "./courses";
import { Student } from "./user-profile";

export interface Grade {
  testType: string;
  marks: number;
  maxMarks: number;
  student: Relation<Student>;
  course: Relation<Course>;
}
export interface GradeResponse {
  docs?: Grade[];
}

export const gradesUrl = `${API_URL}/api/grades`;
