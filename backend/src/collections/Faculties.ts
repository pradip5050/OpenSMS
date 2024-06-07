import { CollectionConfig } from "payload/types";
import { isAdminOrFaculty } from "../access/isAdmin";

const Faculties: CollectionConfig = {
  slug: "faculties",
  access: {
    read: () => true,
    create: isAdminOrFaculty,
    update: isAdminOrFaculty,
    delete: isAdminOrFaculty,
  },
  admin: {
    useAsTitle: "facultyId",
    description: "A faculty",
  },
  fields: [
    { name: "facultyId", label: "Faculty ID", type: "number", required: true },
    {
      name: "number",
      type: "number",
      validate: (val, {}) => {
        if (val >= 10000000000) {
          return "Enter valid mobile number";
        }

        return true;
      },
      required: true,
    },
    { name: "dob", label: "Date Of Birth", type: "date", required: true },
    {
      name: "user",
      type: "relationship",
      relationTo: ["users"],
      hasMany: false,
      required: true,
    },
    {
      name: "courses",
      type: "relationship",
      relationTo: ["courses"],
      hasMany: true,
      required: true,
    },
    { name: "photo", type: "upload", relationTo: "media", required: true },
  ],
};

export default Faculties;
