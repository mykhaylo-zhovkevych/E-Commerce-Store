import z from "zod"

import {baseProcedure, createTRPCRouter} from "@/trpc/init";
import {DEFAULT_LIMIT} from "@/constants/constants";

export const tagsRouter = createTRPCRouter({
    getMany: baseProcedure
        .input(
            z.object({
                cursor: z.number().default(1),
                limit: z.number().default(DEFAULT_LIMIT),
            }),
        )
        .query(async ({ ctx, input }) => {
            return await ctx.payload.find({
            collection: "tags",
            depth: 1,
            page: input.cursor,
            limit: input.limit
        });
    }),
});