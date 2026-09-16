import { getPayload } from "payload";
import config from "@payload-config";
const payload = await getPayload({ config });
const ids = ["6aa91932d410bd719399bd43","6a9044cf2a8485162a8df41d","6aaa8b66d03fd861cf6aea0e"];
const r = await payload.find({ collection: "products", depth: 2, where: { id: { in: ids } } });
console.log("totalDocs", r.totalDocs);
for (const d of r.docs) console.log(d.id, d.name, "tenant=", typeof d.tenant === "object" ? d.tenant?.slug : d.tenant);
for (const slug of ["testuser01","demo","testuser02"]) {
  const t = await payload.find({ collection: "products", depth: 0, where: { "tenant.slug": { equals: slug } } });
  console.log(slug, "->", t.docs.map(d => d.id));
}
process.exit(0);
