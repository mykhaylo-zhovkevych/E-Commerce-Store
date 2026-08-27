// each product belongs to tenant
import {CollectionConfig} from "payload";

export const Tenants: CollectionConfig = {
    slug: 'tenants',
    admin: {
        useAsTitle: 'slug',
    },
    fields: [
        {
            name: "name",
            required: true,
            type: "text",
            label: "Store Name",
            // For the person who in the dashboard
            admin: {
                description: "This is the name of the store (e.g. Naming Store)"
            },
        },
        {
            name: "slug",
            type: "text",
            index: true,
            required: true,
            unique: true,
            admin: {
                description: "This is the subdomain for the store [slug].linkkroad.com"
            }
        },
        {
            name: "image",
            type: "upload",
            relationTo: "media"
        },
        {
            name: "stripeAccountId",
            type: "text",
            required: true,
            admin: {
                readOnly: true,
            },
        },
        {
            name: "stripeDetailsSubmitted",
            type: "checkbox",
            admin: {
                readOnly: true,
                description: "You cannot create products until you submit your Stripe details."
            },
        },
    ],
};