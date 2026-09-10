import { getPayload } from "payload";

import config from "@payload-config";

const testScores = [25, 100, 50, 75, 10] as const;

const assignTestTrendScores = async (): Promise<void> => {
    const payload = await getPayload({ config });

    const products = await payload.find({
        collection: "products",
        limit: testScores.length,
        pagination: false,
        sort: "-trendScore",
    });

    for (const [index, product] of products.docs.entries()) {
        const trendScore = testScores[index];

        if (trendScore === undefined) continue;

        await payload.update({
            collection: "products",
            id: product.id,
            data: { trendScore },
        });

        console.log(`${product.name}: trendScore ${trendScore}`);
    }
};

try {
    await assignTestTrendScores();
    process.exit(0);
} catch (error) {
    console.error("Could not assign test trend scores:", error);
    process.exit(1);
}
