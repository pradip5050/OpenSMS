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
    { name: "description", type: "text", required: true },
    { name: "amount", type: "number", required: true },
    { name: "due_date", type: "date", required: true },
    {
      name: "students",
      type: "relationship",
      relationTo: ["students"],
      hasMany: false,
      required: true,
    },
  ],
};

export default Fees;
