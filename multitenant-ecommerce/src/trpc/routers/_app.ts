import { createTRPCRouter } from '../init';
import {categoriesRouter} from "@/app/modules/categories/server/procedures";
import authRouter from "@/app/modules/auth/server/procedures";
import {productsRouter} from "@/app/modules/products/server/procedures";
import {tagsRouter} from "@/app/modules/tags/server/procedures";

export const appRouter = createTRPCRouter({
    auth: authRouter,
    tags: tagsRouter,
    categories: categoriesRouter,
    products: productsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;