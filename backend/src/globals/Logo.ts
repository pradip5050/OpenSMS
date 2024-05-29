import type { GlobalConfig } from "payload/types";
import { isAdmin } from "../access/isAdmin";

export const LoginLogo: GlobalConfig = {
  slug: "logo",
  access: {
    read: () => true,
    update: isAdmin,
  },
  fields: [
    {
      name: "image",
      label: "Image",
      relationTo: "media",
      type: "upload",
      required: true,
    },
  ],
};
