import configPromise from '@payload-config'
import { getPayload } from 'payload'

export default async function Home() {
    const payload = await getPayload({
        config: configPromise,
    })
    // const data = await payload.find({
    //     collection: "users",
    // })

    const cateData = await payload.find({
        collection: "categories",
        depth: 1,
        pagination: false,
        select: {
            alt: true,
            slug: true,
            color: true,
            parent: true,
            subcategories: true,
        },
        where: {
            parent: {
                exists: true
            },
        },
    });

    return (
        <div>
            {JSON.stringify(cateData.docs, null, 2)}
        </div>
    )
}
