import {baseProcedure, createTRPCRouter} from "@/trpc/init";

export const categoriesRouter = createTRPCRouter({
    getMany: baseProcedure.query(async ({ctx}) => {
        const cateData = await ctx.payload.find({
            collection: "categories",
            depth: 1,
            pagination: false,
            sort: "alt",
            select: {
                alt: true,
                slug: true,
                color: true,
                parent: true,
                subcategories: true,
            },
            where: {
                parent: {
                    exists: false
                },
            },
        });
        return cateData.docs;
    }),
});