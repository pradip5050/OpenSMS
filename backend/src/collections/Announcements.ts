import { CollectionConfig } from "payload/types";
import {
  HTMLConverterFeature,
  lexicalEditor,
  lexicalHTML,
} from "@payloadcms/richtext-lexical";

const Announcements: CollectionConfig = {
  slug: "announcements",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "title",
    description: "An announcement",
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "content",
      type: "richText",
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          HTMLConverterFeature({}),
        ],
      }),
      required: true,
    },
    lexicalHTML("content", { name: "content_html" }),
  ],
};

export default Announcements;
