import z from "zod"
import type {Where, Sort} from "payload";

import {baseProcedure, createTRPCRouter} from "@/trpc/init";
import {sortValues} from "@/app/modules/products/search-params";
import {Media, Tenant} from "@/payload-types";
import {DEFAULT_LIMIT} from "@/constants/constants";

export const productsRouter = createTRPCRouter({
    getOne: baseProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            const product = await  ctx.payload.findByID({
                collection: "products",
                id: input.id
            });

            return {
                ...product,
                image: product.image as Media | null
            }
        }),
    getMany: baseProcedure
        .input(z.object({
                cursor: z.number().default(1),
                limit: z.number().default(DEFAULT_LIMIT),
                category: z.string().nullable().optional(),
                minPrice: z.string().nullable().optional(),
                maxPrice: z.string().nullable().optional(),
                tags: z.array(z.string()).nullable().optional(),
                sort: z.enum(sortValues).nullable().optional(),
                tenantSlug: z.string().nullable().optional(),
            }),
        )
        .query(async ({ ctx, input }) => {
            const where: Where = {};

            // Curated and Hot and new use newest-first by default.
            let sort: Sort = "-createdAt";

            if (input.sort === "trending") {
                // Higher score first: 100 appears before 75.
                sort = "-trendScore";
            }

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

            if (input.tenantSlug) {
                where["tenant.slug"] = {
                    equals: input.tenantSlug,
                };
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

            if (input.tags && input.tags.length >0 ) {
                where["tags.name"] = {
                    in: input.tags
                };
            }

            const cateData = await ctx.payload.find({
                collection: "products",
                depth: 2, // Populate "category", "image" & "image.url"
                where,
                sort,
                page: input.cursor,
                limit: input.limit,
            });

        return {
            ...cateData,
            docs: cateData.docs.map((doc) => ({
                ...doc,
                image: doc.image as Media | null,
                tenant: doc.tenant as Tenant & { image: Media | null }
            }))
        }
    }),
});
