import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Categories } from "./collections/Categories";
import {Products} from "./collections/Products";
import {Tags} from "@/collections/Tags";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Categories, Products, Tags],
  editor: lexicalEditor(),
  cookiePrefix: "linkkroad",
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || "",
    connectOptions: {
      // Recycle idle sockets before common router/NAT timeouts leave stale
      // connections in the pool. The driver reconnects them on demand.
      maxIdleTimeMS: 60_000,
      serverSelectionTimeoutMS: 30_000,
      connectTimeoutMS: 15_000,
      retryReads: true,
      retryWrites: true,
    },
  }),
  sharp,
  plugins: [],
});
