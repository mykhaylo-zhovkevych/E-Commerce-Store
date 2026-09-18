import z from "zod"
import type {Payload, Sort, Where} from "payload";
import {headers as getHeaders} from "next/headers";

import {baseProcedure, createTRPCRouter} from "@/trpc/init";
import {sortValues} from "@/app/modules/products/search-params";
import {Media, Order, Tenant} from "@/payload-types";
import {DEFAULT_LIMIT} from "@/constants/constants";


// Category slug plus all its direct subcategory slugs, so filtering by a parent also matches its children.
const getCategorySlugs = async (payload: Payload, slug: string) => {
    const { docs } = await payload.find({
        collection: "categories",
        limit: 1,
        depth: 1,
        pagination: false,
        where: {
            slug: {
                equals: slug,
            },
        },
    });

    const subcategories = docs[0]?.subcategories?.docs
        ?.flatMap((doc) => (typeof doc === "string" ? [] : doc.slug)) ?? [];

    return [slug, ...subcategories];
};

// The signed-in user's orders for `productIds`, keyed by product id. Empty when signed out.
const getPurchasedOrders = async (payload: Payload, productIds: string[]) => {
    const headers = await getHeaders();
    const session = await payload.auth({ headers });

    if (!session.user || productIds.length === 0) {
        return new Map<string, Order>();
    }

    const { docs } = await payload.find({
        collection: "orders",
        pagination: false,
        depth: 0, // keep `product` as a plain id
        sort: "-createdAt", // if a product was bought twice, keep the latest order
        where: {
            and: [
                { user: { equals: session.user.id } },
                { product: { in: productIds } },
            ],
        },
    });

    return new Map(
        docs
            .reverse() // Map keeps the last write, so insert oldest first
            .map((order) => [typeof order.product === "string" ? order.product : order.product.id, order]),
    );
};

export const productsRouter = createTRPCRouter({
    getOne: baseProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            const product = await ctx.payload.findByID({
                collection: "products",
                id: input.id,
                depth: 2,
            });

            const order = (await getPurchasedOrders(ctx.payload, [product.id])).get(product.id);

            return {
                ...product,
                isPurchased: !!order,
                image: product.image as Media | null,
                tenant: product.tenant as Tenant & { image: Media | null },
            }
        }),
    getMany: baseProcedure
        .input(z.object({
                cursor: z.number().default(1),
                limit: z.number().default(DEFAULT_LIMIT),
                category: z.string().nullable().optional(),
                minPrice: z.coerce.number().nullable().optional(),
                maxPrice: z.coerce.number().nullable().optional(),
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
                where["category.slug"] = {
                    in: await getCategorySlugs(ctx.payload, input.category),
                };
            }

            if (input.tags && input.tags.length >0 ) {
                where["tags.name"] = {
                    in: input.tags
                };
            }

            const productsData = await ctx.payload.find({
                collection: "products",
                depth: 2, // Populate "category", "image" & "image.url"
                where,
                sort,
                page: input.cursor,
                limit: input.limit,
            });

        const purchasedOrders = await getPurchasedOrders(ctx.payload, productsData.docs.map((doc) => doc.id));
        return {
            ...productsData,
            docs: productsData.docs.map((doc) => ({
                ...doc,
                isPurchased: purchasedOrders.has(doc.id),
                image: doc.image as Media | null,
                tenant: doc.tenant as Tenant & { image: Media | null }
            }))
        }
    }),
});
