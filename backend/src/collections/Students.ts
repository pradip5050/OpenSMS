import { CollectionConfig } from "payload/types";

const Students: CollectionConfig = {
  slug: "students",
  //   access: {}
  admin: {
    useAsTitle: "name",
    description: "A student",
  },
  upload: {
    staticURL: "/pfp",
    staticDir: "pfp",
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 400,
        position: "centre",
      },
    ],
    adminThumbnail: "thumbnail",
    mimeTypes: ["image/*"],
  },
  fields: [
    { name: "name", type: "text" },
    {
      name: "alt",
      type: "text",
    },
  ],
};

export default Students;
