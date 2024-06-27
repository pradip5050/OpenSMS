import { API_URL } from "../constants";

export interface Subject {
  id: string;
  code: string;
  name: string;
}
export interface SubjectResponse {
  docs?: Subject[];
}

export const subjectsUrl = `${API_URL}/api/subjects`;
