import { API_URL } from "../constants";
import { Relation } from "../utils";
import { Course } from "./courses";
import { Student } from "./students";

export interface Grade {
  id: string;
  testType: string;
  marks: number;
  maxMarks: number;
  student: Relation<Student>;
  course: Relation<Course>;
}
export interface GradeResponse {
  docs?: Grade[];
}
export interface GradePayload {
  student: Relation<string>;
  course: Relation<string>;
  testType: string;
  maxMarks: number;
  marks: number;
}

export const gradesUrl = `${API_URL}/api/grades`;
