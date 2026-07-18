import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import {TRPCError} from "@trpc/server";
import { headers as getHeaders, cookies as getCookies } from "next/headers";
import { z } from "zod";
import {AUTH_COOKIE} from "../../../../../public/constance";
import {registerSchema} from "@/app/modules/auth/schemas";

const authRouter = createTRPCRouter({
    session: baseProcedure.query(async ({ ctx }) => {
        const headers = await getHeaders();
        const session = await ctx.payload.auth({ headers });

        return session;
    }),
    logout: baseProcedure.mutation(async () => {
        const cookies = await getCookies();
        cookies.delete(AUTH_COOKIE);
    }),
    register: baseProcedure.input(registerSchema)
// input is the zod's validation above
        .mutation(async ({ input, ctx }) => {
            await ctx.payload.create({
                collection: "users",
                data: {
                    email: input.email,
                    username: input.username,
                    password: input.password, // payload handels the hashing
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

            const cookies = await getCookies();
            cookies.set({
                name: AUTH_COOKIE,
                value: data.token,
                httpOnly: true,
                path: "/",
            });

        }),
    login: baseProcedure.input(z.object({
        email: z.string().email(),
        password: z.string().min(8).max(100),
        username: z.string().min(3, "username must be at least 3 caracteres").max(63, "username must be less than 63 characters").regex(
            /^[a-z0-9][a-z0-9-]*[a-z0-9]$/, "user can contain only lowercase latters, number adn hyphens. It must start and end with a letter or number").refine((val) => !val.includes("--"), "Username cannot contain consecutive hyphens").transform((val) => val.toLowerCase()),
    }))
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

            const cookies = await getCookies();
            cookies.set({
                name: AUTH_COOKIE,
                value: data.token,
                httpOnly: true,
                // path: "/",
                // sameSite: "lax",
                // secure: process.env.NODE_ENV === "production",
                // // TODO: cross domain cookies sharing, dont do this
            });
            return data;
        }),
});
export default authRouter
