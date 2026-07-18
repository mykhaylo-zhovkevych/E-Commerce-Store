import {baseProcedure} from "@/trpc/init";
import {TRPCError} from "@trpc/server";
import {cookies as getCookies} from "next/dist/server/request/cookies";
import {AUTH_COOKIE} from "../../../../public/constance";

import z from "zod";

export const registerSchema =
    z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(8).max(100),
    username: z.string().min(3, "username must be at least 3 caracteres")
        .max(63, "username must be less than 63 characters")
        .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, "user can contain only lowercase latters, number adn hyphens. It must start and end with a letter or number")
        .refine((val) => !val.includes("--"), "Username cannot contain consecutive hyphens")
        .transform((val) => val.toLowerCase())
    }
);

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(100),
    username: z.string().min(3, "username must be at least 3 caracteres").max(63, "username must be less than 63 characters").regex(
        /^[a-z0-9][a-z0-9-]*[a-z0-9]$/, "user can contain only lowercase latters, number adn hyphens. It must start and end with a letter or number").refine((val) => !val.includes("--"), "Username cannot contain consecutive hyphens").transform((val) => val.toLowerCase()),
});
