import { CollectionConfig } from "payload/types";

const Branches: CollectionConfig = {
  slug: "branches",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "name",
    description: "A branch",
  },
  fields: [
    { name: "id", type: "number", required: true },
    { name: "name", type: "text", required: true },
    {
      name: "courses",
      type: "relationship",
      relationTo: ["courses"],
      hasMany: true,
      required: true,
    },
  ],
};

export default Branches;
