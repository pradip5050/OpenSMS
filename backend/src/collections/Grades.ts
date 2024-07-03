import { CollectionConfig } from "payload/types";
import { isAdminOrFaculty } from "../access/isAdmin";
import type { Validate } from "payload/types";

const Grades: CollectionConfig = {
  slug: "grades",
  access: {
    create: isAdminOrFaculty,
    update: isAdminOrFaculty,
    delete: isAdminOrFaculty,
    admin: isAdminOrFaculty,
  },
  admin: {
    useAsTitle: "amount",
  },
  fields: [
    { name: "testType", type: "text", required: true },
    {
      name: "marks",
      type: "number",
      min: 0,
      max: 100,
      required: true,
      validate: (value, { siblingData }) => {
        return (
          value <= siblingData.maxMarks ||
          "Marks should be lesser or equal to Max Marks"
        );
      },
    },
    {
      name: "maxMarks",
      type: "number",
      min: 0,
      max: 100,
      required: true,
    },
    {
      name: "student",
      type: "relationship",
      relationTo: "students",
      hasMany: false,
      required: true,
    },
    {
      name: "course",
      type: "relationship",
      relationTo: "courses",
      hasMany: false,
      required: true,
    },
  ],
};

export default Grades;
