import { CollectionConfig } from "payload/types";

const Attendances: CollectionConfig = {
  slug: "attendances",
  access: {},
  admin: {
    useAsTitle: "name",
    description: "A student attendance",
  },
  fields: [
    { name: "date", type: "date", required: true },
    { name: "isPresent", type: "checkbox", required: true },
    {
      name: "course",
      type: "relationship",
      relationTo: ["courses"],
      hasMany: false,
      required: true,
    },
    {
      name: "student",
      type: "relationship",
      relationTo: ["students"],
      hasMany: false,
      required: true,
    },
  ],
};

export default Attendances;
