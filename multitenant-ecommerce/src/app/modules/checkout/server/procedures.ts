import z from "zod"
import type {Where, Sort} from "payload";
import type Stripe from "stripe";

import {baseProcedure, createTRPCRouter, protectedProcedure} from "@/trpc/init";
import {Media, Tenant} from "@/payload-types";
import {TRPCError} from "@trpc/server";
import {productsRouter} from "@/app/modules/products/server/procedures";
import {CheckoutMetadata, ProductMetadata} from "@/app/modules/checkout/types";
import {stripe} from "@/lib/stripe";
import {generateTenantURL} from "@/lib/utils";


export const checkoutRouter = createTRPCRouter({
    purchase: protectedProcedure.input(
        z.object({
            productIds: z.array(z.string()).min(1),
            tenantSlug: z.string().min(1),
        })
    ).mutation(async ({ctx, input}) => {
        const products= await ctx.payload.find({
            collection: "products",
            depth: 2,
            where: {
                and: [
                    {
                     id: {
                         in: input.productIds
                     }
                    },
                    {
                        "tenant.slug": {
                            equals: input.tenantSlug
                        }
                    }
                ]
            }
        })

        if (products.totalDocs !== input.productIds.length) {
            throw new TRPCError({code: "NOT_FOUND", message: "Product not found."});
        }
        const tenantsData = await ctx.payload.find({
            collection: "tenants",
            limit: 1,
            pagination: false,
            where: {
                slug: {
                    equals: input.tenantSlug,
                },
            },
        });
        const tenant = tenantsData.docs[0];
        if (!tenant) {
            throw new TRPCError({code: "NOT_FOUND", message: "Tenant not found."});
        }

        // Sripe after connecting

        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
            products.docs.map((product) => ({
                quantity: 1,
                price_data: {
                    unit_amount: product.price * 100,
                    currency: "USD",
                    product_data: {
                        name: product.name,
                        metadata:{
                            stripeAccountId: tenant.stripeAccountId,
                            id: product.id,
                            name: product.name,
                            price: product.price,
                        } satisfies ProductMetadata
                    }
                }
            }));

        const checkout = await stripe.checkout.sessions.create({
            customer_email: ctx.session.user.email,
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input.tenantSlug}/checkout?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input.tenantSlug}/checkout?cancel=true`,
            mode: "payment",
            line_items: lineItems,
            invoice_creation: {
                enabled: true,
            },
            metadata: {
                userId: ctx.session.user.id,
            } satisfies CheckoutMetadata
        });

        if (!checkout.url) {
            throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Failed to create checkout session."});
        }
        return { url: checkout.url};
    }),
    getProducts: baseProcedure
        .input(z.object({
                ids: z.array(z.string())
            }),
        )
        .query(async ({ ctx, input }) => {
            const data = await ctx.payload.find({
                collection: "products",
                depth: 2,
                where: {
                    id: {
                        in: input.ids,
                    },
                }
            });

            if (data.totalDocs !== input.ids.length) {
                throw new TRPCError({code: "NOT_FOUND", message: "Products not found."});
            }

        return {
            ...data,
            totalPrice: data.docs.reduce((acc, product) => acc + product.price, 0),
            docs: data.docs.map((doc) => ({
                ...doc,
                image: doc.image as Media | null,
                tenant: doc.tenant as Tenant & { image: Media | null }
            }))
        }
    }),
});
