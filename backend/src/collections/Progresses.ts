import { CollectionConfig } from "payload/types";
import { isAdminOrFaculty } from "../access/isAdmin";

const Progresses: CollectionConfig = {
  slug: "progresses",
  access: {
    create: isAdminOrFaculty,
    update: isAdminOrFaculty,
    delete: isAdminOrFaculty,
  },
  admin: {
    useAsTitle: "percent",
    description: "A subject progress",
  },
  fields: [
    { name: "percent", type: "number", max: 100, required: true },
    // Restrict to subjects part of courses student has enrolled in
    {
      name: "subject",
      type: "relationship",
      relationTo: "subjects",
      hasMany: false,
      required: true,
    },
    {
      name: "student",
      type: "relationship",
      relationTo: "students",
      hasMany: false,
      required: true,
    },
  ],
};

export default Progresses;
