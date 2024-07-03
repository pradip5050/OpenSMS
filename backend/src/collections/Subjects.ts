import { CollectionConfig } from "payload/types";
import { isAdminOrFaculty } from "../access/isAdmin";

const Subjects: CollectionConfig = {
  slug: "subjects",
  access: {
    create: isAdminOrFaculty,
    update: isAdminOrFaculty,
    delete: isAdminOrFaculty,
    admin: isAdminOrFaculty,
  },
  admin: {
    useAsTitle: "name",
    description: "A subject",
  },
  fields: [
    { name: "code", type: "text", unique: true, required: true },
    { name: "name", type: "text", required: true },
  ],
};

export default Subjects;
