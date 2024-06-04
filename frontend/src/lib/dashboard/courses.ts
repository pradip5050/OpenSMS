export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
}
export interface CourseRelation {
  // TODO: Convert to a generic type
  relationTo: string;
  value: Course;
}
