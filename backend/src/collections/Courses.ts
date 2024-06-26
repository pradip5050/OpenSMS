import { CollectionConfig } from "payload/types";
import { isAdminOrFaculty } from "../access/isAdmin";

const Courses: CollectionConfig = {
  slug: "courses",
  access: {
    create: isAdminOrFaculty,
    update: isAdminOrFaculty,
    delete: isAdminOrFaculty,
  },
  // TODO: Add duration
  // TODO: Add subjects list
  admin: {
    useAsTitle: "name",
    description: "A course",
  },
  fields: [
    { name: "code", type: "text", unique: true, required: true },
    { name: "name", type: "text", required: true },
    { name: "credits", type: "number", required: true },
  ],
};

export default Courses;
