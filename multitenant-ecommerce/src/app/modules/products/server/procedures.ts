import z from "zod"
import type {Where} from "payload";

import {baseProcedure, createTRPCRouter} from "@/trpc/init";

export const productsRouter = createTRPCRouter({
    getMany: baseProcedure
        .input(
            z.object({
                category: z.string().nullable().optional(),
                minPrice: z.string().nullable().optional(),
                maxPrice: z.string().nullable().optional(),
            }),
        )
        .query(async ({ ctx, input }) => {
            const where: Where = {};

            if (input.minPrice) {
                where.price = {
                    ...where.price,
                    greater_than_equal: input.minPrice,
                }
            }
            if (input.maxPrice) {
                where.price = {
                    ...where.price,
                    less_than_equal: input.maxPrice,
                }
            }

            if (input.category) {
                const categoriesData = await ctx.payload.find({
                    collection: "categories",
                    limit: 1,
                    depth: 1,
                    pagination: false,
                    where: {
                        slug: {
                            equals: input.category,
                        }
                    }
                });

                const subcategories = categoriesData.docs[0]?.subcategories?.docs?.flatMap((doc) => typeof doc === "string" ? [] : doc.slug,) ?? [];
                where["category.slug"] = {
                    in: [input.category, ...subcategories],
                };
            }

            const cateData = await ctx.payload.find({
                collection: "products",
                depth: 1,
                sort: "alt",
                where,
            });

        return cateData.docs;
    }),
});