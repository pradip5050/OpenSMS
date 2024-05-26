import { CollectionConfig } from "payload/types";
import { isAdmin } from "../access/isAdmin";

const Users: CollectionConfig = {
  // Email added by default
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "name",
    disableDuplicate: true,
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
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
