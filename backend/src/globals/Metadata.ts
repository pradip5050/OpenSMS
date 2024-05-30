import type { GlobalConfig } from "payload/types";
import { isAdmin } from "../access/isAdmin";

export const Metadata: GlobalConfig = {
  slug: "metadata",
  access: {
    read: () => true,
    update: isAdmin,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "logo",
      relationTo: "media",
      type: "upload",
      required: true,
    },
  ],
};
