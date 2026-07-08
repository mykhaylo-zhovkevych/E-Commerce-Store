import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
    slug: 'categories',
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'alt',
            type: 'text',
            required: true,
        },
    ],
    upload: true,
}
