"use client";

import { Poppins } from "next/font/google";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";

import { toast } from "sonner";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerSchema } from "@/app/modules/auth/schemas";


import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormDescription,
    FormMessage
} from "@/components/ui/form";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {useTRPC} from "@/trpc/client";
import {useRouter} from "next/navigation";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["700"],
});

export const SignUpView = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof registerSchema>>({
        mode: "all",
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            username: "",
        }
    });

    const username = useWatch({
        control: form.control,
        name: "username",
    });
    const usernameErrors = form.formState.errors.username;
    const showPreview = username && !usernameErrors;

    const trpc = useTRPC();
    const register = useMutation(trpc.auth.register.mutationOptions({onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries(trpc.auth.session.queryFilter())
            router.push("/");
        }}
    ));

    const onSubmit = (values: z.infer<typeof registerSchema>) => { register.mutate(values) };

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
                                <Link prefetch href="/sign-in">
                                    Sign In
                                </Link>
                            </Button>
                        </div>
                        <h1 className="text-2xl font-medium">
                            (Marketing)Join over 1,000 creators earning money on the Linkk
                        </h1>
                        <FormField
                            name="username"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel className="text-base">
                                            Username
                                        </FormLabel>
                                        <FormControl>
                                            {/* spreading ensure that it has all needed values i.e ControllerProps, FieldPath, FieldValues*/}
                                            <Input {...field} />
                                        </FormControl>
                                        <FormDescription className={cn("hidden", showPreview && "block")}>
                                            Your score will be available at
                                            <strong>{username}</strong>
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
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
                                        <FormDescription className={cn("hidden", showPreview && "block")}>
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
                                        <FormDescription className={cn("hidden", showPreview && "block")}>
                                            Your score will be available at
                                            <strong>{"Password"}</strong>
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                        <Button type="submit" size="lg" variant="elevated" className="bg-black text-white hover:bg-pink-400 hover:text-primary" disabled={register.isPending}>
                            Create account
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
