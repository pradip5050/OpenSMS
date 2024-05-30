import path from "path";

import { payloadCloud } from "@payloadcms/plugin-cloud";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import { slateEditor } from "@payloadcms/richtext-slate";
import { buildConfig } from "payload/config";

import Users from "./collections/Users";
import Students from "./collections/Students";
import Media from "./collections/Media";
import Courses from "./collections/Courses";
import { Metadata } from "./globals/Metadata";
import Announcements from "./collections/Announcements";
import stripePlugin from "@payloadcms/plugin-stripe";

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
  },
  cors: "*",
  // csrf: ["http://127.0.0.1:3000"],
  editor: slateEditor({}),
  collections: [Users, Announcements, Students, Courses, Media],
  globals: [Metadata],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
  plugins: [
    payloadCloud(),
    stripePlugin({
      stripeSecretKey: process.env.STRIPE_SECRET_KEY,
      rest: true,
      logs: true,
    }),
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
});
