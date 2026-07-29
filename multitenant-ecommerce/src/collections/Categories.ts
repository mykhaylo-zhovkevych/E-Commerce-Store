import type {
    // CollectionBeforeChangeHook,
    CollectionConfig,
} from 'payload'

// const getRelationshipId = (value: unknown): number | string | undefined => {
//     if (typeof value === 'number' || typeof value === 'string') {
//         return value
//     }
//     if (value && typeof value === 'object' && 'id' in value) {
//         const id = value.id
//         if (typeof id === 'number' || typeof id === 'string') {
//             return id
//         }
//     }
//     return undefined
// }



// const preventNestedSubcategories: CollectionBeforeChangeHook = async ({data, req }) => {
//     const parentId = getRelationshipId(data.parent)
//
//     if (!parentId) {
//         return data
//     }
//
//     const parent = await req.payload.findByID({
//         collection: 'categories',
//         id: parentId,
//         depth: 0,
//     })
//
//     if (parent.parent) {
//         throw new Error('Subcategories cannot contain other subcategories.')
//     }
//
//     return data
// }

export const Categories: CollectionConfig = {
    slug: 'categories',
    admin: {
        useAsTitle: "alt",
    },
    access: {
        read: () => true,
    },
    // After first update
    // hooks: {
    //     beforeChange: [preventNestedSubcategories],
    // },
    fields: [
        {
            name: 'alt',
            type: 'text',
            required: true,
        },
        // Each category has it's unique id
        {
            name: "slug",
            type: "text",
            required: true,
            unique: true,
            index: true,
        },
        // Each category has it's own background color
        {
            name: "color",
            type: "text",
        },
        // If category does not have the parent category then it must be a parent itself
        {
            name: "parent",
            type: "relationship",
            relationTo: "categories",
            hasMany: false,
        },
        {
            name: "subcategories",
            type: "join",
            collection: "categories",
            on: "parent",
            hasMany: true,
        },
    ],
    upload: true,
}
