import config from "@payload-config";
import { notFound } from "next/navigation";
import { getPayload } from "payload";

const Page = async ({params}: {
    params: Promise<{ category: string; subcategory: string }>;
}) => {
    const { category, subcategory } = await params;
    const payload = await getPayload({ config });

    const parentResult = await payload.find({
        collection: "categories",
        limit: 1,
        where: {
            slug: { equals: category },
            parent: { exists: false },
        },
    });
    const parent = parentResult.docs[0];

    if (!parent) {
        notFound();
    }

    const subcategoryResult = await payload.find({
        collection: "categories",
        limit: 1,
        where: {
            slug: { equals: subcategory },
            parent: { equals: parent.id },
        },
    });

    if (subcategoryResult.docs.length === 0) {
        notFound();
    }

    return (
        <div>
        test
        </div>
    );
};

export default Page;