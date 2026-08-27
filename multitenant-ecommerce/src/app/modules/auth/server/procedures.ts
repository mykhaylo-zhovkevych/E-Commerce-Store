import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import {TRPCError} from "@trpc/server";
import { headers as getHeaders } from "next/headers";
import {loginSchema, registerSchema} from "@/app/modules/auth/schemas";
import {generateAuthCookie} from "@/app/modules/auth/utils";

const authRouter = createTRPCRouter({
    session: baseProcedure.query(async ({ ctx }) => {
        const headers = await getHeaders();
        const session = await ctx.payload.auth({ headers });

        return session;
    }),
    // logout: baseProcedure.mutation(async () => {
    //     const cookies = await getCookies();
    //     cookies.delete(AUTH_COOKIE);
    // }),
    register: baseProcedure.input(registerSchema)
        // input is the zod's validation above
        .mutation(async ({ input, ctx }) => {
            const existingData = await ctx.payload.find({
                collection: "users",
                limit: 1,
                where: {
                    username: {
                        equals: input.username,
                    },
                },
            });
            const existingUser = existingData.docs[0];

            if (existingUser) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Username allready taken",
                });
            }

            const tenant = await ctx.payload.create({
                collection: "tenants",
                data: {
                    name: input.username,
                    // Because username has to be unique
                    slug: input.username,
                    stripeAccountId: "test"
                }
            })

            await ctx.payload.create({
                collection: "users",
                data: {
                    email: input.email,
                    username: input.username,
                    password: input.password, // payload handels the hashing
                    // explain to me one tentan per one user?
                    tenants: [
                        {
                            tenants: tenant.id
                        },
                    ],
                },
            });

            // After user register automatically login in

            const data = await ctx.payload.login({
                collection: "users",
                data: {
                    email: input.email,
                    password: input.password
                },
            });
            if (!data.token) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Failed to login",
                });
            }

        }),
    login: baseProcedure.input(loginSchema)
        // input is the zod's validation above
        .mutation(async ({ input, ctx }) => {
            const data = await ctx.payload.login({
                collection: "users",
                data: {
                    email: input.email,
                    password: input.password
                },
            });
            if (!data.user || !data.token) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Invalid email or password",
                });
            }

            await generateAuthCookie({
                prefix: ctx.payload.config.cookiePrefix,
                value: data.token
            });
            return data;
        }),
});
export default authRouter
