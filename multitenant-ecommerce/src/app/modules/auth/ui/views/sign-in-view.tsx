"use client";

import { Poppins } from "next/font/google";
import { useForm, useWatch } from "react-hook-form";
import {useRouter} from "next/navigation";
import z from "zod";
import { toast } from "sonner";
import Link from "next/link";

import {useMutation, useQueryClient} from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginSchema } from "@/app/modules/auth/schemas";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormDescription,
    FormMessage
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
// import {useTRPC} from "@/trpc/client";
import {useTRPC} from "@/trpc/client";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["700"],
});

export const SignInView = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof loginSchema>>({
        mode: "all",
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const trpc = useTRPC();
    const login = useMutation(trpc.auth.login.mutationOptions(
        {onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries(trpc.auth.session.queryFilter())
            router.push("/");
        }})
    );

    const onSubmit = (values: z.infer<typeof loginSchema>) => { login.mutate(values) };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="bg-[#dedede] h-screen w-full lg:col-span-3 overflow-y-auto">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8 p-4 lg:p-16">
                        <div className="flex items-center justify-between mb-8">
                            <Link href="/">
                                <span className={cn("text-2xl font-semibold", poppins.className)}>Linkk</span>
                            </Link>
                            <Button asChild variant="ghost" size="sm" className="text-base border-none underline">
                                <Link prefetch href="/sign-up">
                                    Sign Up
                                </Link>
                            </Button>
                        </div>
                        <h1 className="text-2xl font-medium">
                            Welcome Back to Linkk
                        </h1>
                        <FormField
                            name="email"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel className="text-base">
                                            E-Mail
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormDescription className={cn("hidden", "block")}>
                                            Your score will be available at
                                            <strong>{"E-Mail"}</strong>
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                        <FormField
                            name="password"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel className="text-base">
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} type="password" />
                                        </FormControl>
                                        <FormDescription className={cn("hidden")}>
                                            Your score will be available at
                                            <strong>{"Password"}</strong>
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                        <Button type="submit" size="lg" variant="elevated" className="bg-black text-white hover:bg-pink-400 hover:text-primary" disabled={login.isPending}>
                            Login In
                        </Button>
                    </form>
                </Form>
            </div>
            <div className="h-screen w-full lg:col-span-2 hidden lg:block" style={{
                backgroundImage: "url('/auth-bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}>
                {/*Background column*/}
            </div>
        </div>
    );
};
