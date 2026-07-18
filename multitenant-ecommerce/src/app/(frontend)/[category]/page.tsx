import config from "@payload-config";
import { notFound } from "next/navigation";
import { getPayload } from "payload";

const Page = async ({params}: {
        params: Promise<{ category: string }>;
}) => {
    const { category } = await params;
    const payload = await getPayload({ config });

    const result = await payload.find({
        collection: "categories",
        limit: 1,
        where: {
            slug: { equals: category },
            parent: { exists: false },
        },
    });

    if (result.docs.length === 0) {
        notFound();
    }

    return (
        <div>
        test
        </div>
    );
};

export default Page;