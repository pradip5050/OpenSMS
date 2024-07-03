import { CollectionConfig } from "payload/types";
import { isAdmin } from "../access/isAdmin";

const Faculties: CollectionConfig = {
  slug: "faculties",
  access: {
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
    admin: isAdmin,
  },
  admin: {
    useAsTitle: "facultyId",
    description: "A faculty",
  },
  fields: [
    {
      name: "facultyId",
      label: "Faculty ID",
      type: "number",
      unique: true,
      required: true,
    },
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
      relationTo: "users",
      hasMany: false,
      unique: true,
      required: true,
    },
    {
      name: "courses",
      type: "relationship",
      relationTo: "courses",
      hasMany: true,
      minRows: 1,
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
    { name: "photo", type: "upload", relationTo: "media", required: true },
  ],
};

export default Faculties;
