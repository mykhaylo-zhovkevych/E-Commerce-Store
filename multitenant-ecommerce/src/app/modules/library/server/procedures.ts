import z from "zod"

import { DEFAULT_LIMIT } from "@/constants/constants";
import {Media, Tag, Tenant} from "@/payload-types"
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const libraryRouter = createTRPCRouter({
    // Products the signed-in user has an order for, newest purchase first
    getMany: protectedProcedure
        .input(
            z.object({
                cursor: z.number().default(1),
                limit: z.number().default(DEFAULT_LIMIT),
                tags: z.array(z.string()).nullable().optional(),
            }),
        )
        .query(async ({ ctx, input }) => {
            const ordersData = await ctx.payload.find({
                collection: "orders",
                depth: 0,
                page: input.cursor,
                limit: input.limit,
                sort: "-createdAt",
                where: {
                    user: {
                        equals: ctx.session.user.id,
                    },
                },
            });

            const productIds = ordersData.docs.map((order) => typeof order.product === "string" ? order.product : order.product.id);
            const productsData = await ctx.payload.find({
                collection: "products",
                depth: 2,
                pagination: false,
                where: {
                    id: {
                        in: productIds,
                    },
                },
            });

            return {
                ...ordersData,
                docs: productsData.docs.map((doc) => ({
                    ...doc,
                    tags: (doc.tags ?? []) as Tag[],
                    image: doc.image as Media | null,
                    tenant: doc.tenant as Tenant & { image: Media | null },
                })),
            };
        }),
});


