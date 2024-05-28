import { CollectionConfig } from "payload/types";

const Fees: CollectionConfig = {
  slug: "fees",
  access: {},
  admin: {
    useAsTitle: "name",
    description: "A student fee",
  },
  fields: [
    { name: "id", type: "number", required: true },
    { name: "isPresent", type: "checkbox", required: true },
    { name: "date", type: "date", required: true },
    {
      name: "courses",
      type: "relationship",
      relationTo: ["courses"],
      hasMany: false,
      required: true,
    },
    {
      name: "users",
      type: "relationship",
      relationTo: ["users"],
      hasMany: false,
      required: true,
    },
  ],
};

export default Fees;
