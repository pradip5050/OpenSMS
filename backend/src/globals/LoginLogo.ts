import type { GlobalConfig } from "payload/types";
import { isAdmin } from "../access/isAdmin";

export const LoginLogo: GlobalConfig = {
  slug: "loginlogo",
  access: {
    read: () => true,
    update: isAdmin,
  },
  fields: [
    {
      name: "logo",
      relationTo: "media",
      type: "upload",
      required: true,
    },
  ],
};
