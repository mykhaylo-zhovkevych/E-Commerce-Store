import {categoriesRouter} from "@/app/modules/categories/server/procedures";
import authRouter from "@/app/modules/auth/server/procedures";
import { createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
    auth: authRouter,
    categories: categoriesRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;