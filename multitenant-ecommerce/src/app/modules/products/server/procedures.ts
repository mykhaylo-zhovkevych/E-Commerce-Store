import z from "zod"

import {baseProcedure, createTRPCRouter} from "@/trpc/init";
import type {Where} from "payload";

export const productsRouter = createTRPCRouter({
    getMany: baseProcedure
        .input(
            z.object({
                category: z.string().nullable().optional(),
            }),
        )
        .query(async ({ctx, input }) => {

            const where: Where = {};

            if (input.category) {
                const categoriesData = await ctx.payload.find({
                    collection: "categories",
                    limit: 1,
                    pagination: false,
                    where: {
                        slug: {
                            equals: input.category,
                        }
                    }
                });

                const category = categoriesData.docs[0];

                if (category) {
                    where["category.slug"] = {
                        equals: category.slug,
                    }
                }
            }

            const cateData = await ctx.payload.find({
                collection: "products",
                depth: 1,
                sort: "alt",
                where, // must be assigned
            });

        // await new Promise((resolve) => setTimeout(resolve, 5000));


        return cateData.docs;
    }),
});