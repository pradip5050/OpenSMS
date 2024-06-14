import { CollectionConfig } from "payload/types";

const Courses: CollectionConfig = {
  slug: "courses",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "name",
    description: "A course",
  },
  fields: [
    { name: "code", type: "text", unique: true, required: true },
    { name: "name", type: "text", required: true },
    { name: "credits", type: "number", required: true },
  ],
};

export default Courses;
