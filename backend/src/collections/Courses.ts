import { CollectionConfig } from "payload/types";
import { isAdminOrFaculty } from "../access/isAdmin";

const Courses: CollectionConfig = {
  slug: "courses",
  access: {
    create: isAdminOrFaculty,
    update: isAdminOrFaculty,
    delete: isAdminOrFaculty,
    admin: isAdminOrFaculty,
  },
  admin: {
    useAsTitle: "name",
    description: "A course",
  },
  fields: [
    { name: "code", type: "text", unique: true, required: true },
    { name: "name", type: "text", required: true },
    { name: "credits", type: "number", required: true },
    {
      name: "duration",
      label: "Duration (in months)",
      type: "number",
      required: true,
    },
    {
      name: "subjects",
      type: "relationship",
      relationTo: "subjects",
      hasMany: true,
      minRows: 1,
      required: true,
    },
  ],
};

export default Courses;
