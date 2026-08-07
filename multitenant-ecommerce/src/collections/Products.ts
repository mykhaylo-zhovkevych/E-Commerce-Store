import type { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
    slug: "products",
    fields: [
        {
            name: "name",
            type: "text",
            required: true,
        },
        {
            name: "description",
            type: "text",
        },
        {
            "name": "price",
            type: "number",
            required: true,
            admin: {
                description: "in USD"
            }
        },
        {
            // Temporary test data: higher scores appear first
            name: "trendScore",
            type: "number",
            defaultValue: 0,
        },
        {
            name: "category",
            type: "relationship",
            relationTo: "categories",
            hasMany: false
        },
        {
            name: "tags",
            type: "relationship",
            relationTo: "tags",
            hasMany: true,
        },
        {
            name: "image",
            type: "upload",
            relationTo: "media"
        },
        {
            name: "refundPolicy",
            type: "select",
            options: ["30-day", "14-day", "7-day", "no-refunds"],
            defaultValue: "30-day",
        }
    ],
};
