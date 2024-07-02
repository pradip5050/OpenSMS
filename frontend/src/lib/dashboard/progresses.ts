import { API_URL } from "../constants";
import { Student } from "./students";
import { Subject } from "./subjects";

export interface Progress {
  id: string;
  percent: number;
  student: Student;
  subject: Subject;
}
export interface ProgressResponse {
  docs?: Progress[];
}
export interface ProgressPayload {
  percent: number;
  student: string;
  subject: string;
}

export const progressesUrl = `${API_URL}/api/progresses`;
