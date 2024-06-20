import { CollectionConfig } from "payload/types";
import { isAdminOrFaculty } from "../access/isAdmin";

const Grades: CollectionConfig = {
  slug: "grades",
  access: {
    create: isAdminOrFaculty,
    update: isAdminOrFaculty,
    delete: isAdminOrFaculty,
  },
  admin: {
    useAsTitle: "amount",
  },
  fields: [
    { name: "testType", type: "text", required: true },
    { name: "marks", type: "number", min: 0, max: 100, required: true },
    { name: "maxMarks", type: "number", min: 0, max: 100, required: true },
    {
      name: "student",
      type: "relationship",
      relationTo: ["students"],
      hasMany: false,
      required: true,
    },
    {
      name: "course",
      type: "relationship",
      relationTo: ["courses"],
      hasMany: false,
      required: true,
    },
  ],
};

export default Grades;
