import { CollectionConfig } from "payload/types";

const Marks: CollectionConfig = {
  slug: "marks",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "amount",
  },
  fields: [
    { name: "testType", type: "text", required: true },
    { name: "amount", type: "number", min: 0, max: 100, required: true },
    {
      name: "student",
      type: "relationship",
      relationTo: ["students"],
      hasMany: false,
      required: true,
    },
    {
      name: "course",
      type: "relationship",
      relationTo: ["courses"],
      hasMany: false,
      required: true,
    },
  ],
};

export default Marks;
