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
import Branches from "./collections/Branches";
import { LoginLogo } from "./globals/LoginLogo";

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
  },
  cors: "*",
  csrf: ["http://127.0.0.1:3000"],
  editor: slateEditor({}),
  collections: [Users, Students, Courses, Branches, Media],
  globals: [LoginLogo],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
  plugins: [payloadCloud()],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
});
