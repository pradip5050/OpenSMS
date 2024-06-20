import { CollectionConfig } from "payload/types";
import { isAdminOrFaculty } from "../access/isAdmin";

const Students: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
    create: isAdminOrFaculty,
    update: isAdminOrFaculty,
    delete: isAdminOrFaculty,
  },
  admin: {
    useAsTitle: "alt",
    description: "A media object",
  },
  upload: {
    staticURL: "/media",
    staticDir: "media",
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
  fields: [{ name: "alt", type: "text" }],
};

export default Students;
