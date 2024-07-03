import { CollectionConfig } from "payload/types";
import { isAdmin } from "../access/isAdmin";

const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "name",
    disableDuplicate: true,
  },
  access: {
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
    admin: isAdmin,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "roles",
      type: "select",
      hasMany: false,
      defaultValue: "student",
      required: true,
      options: [
        { label: "Admin", value: "admin" },
        { label: "Faculty", value: "faculty" },
        { label: "Student", value: "student" },
      ],
    },
  ],
};

export default Users;
