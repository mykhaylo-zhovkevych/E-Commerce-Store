import {Suspense} from "react";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import {caller, getQueryClient, trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {ProductList,ProductListSkeleton} from "@/app/modules/products/ui/components/product-list";

const Page = async ({params}: {
        params: Promise<{ category: string }>;
}) => {
    const { category } = await params;
    // const payload = await getPayload({ config });
    //
    //
    //
    // const result = await payload.find({
    //     collection: "categories",
    //     limit: 1,
    //     where: {
    //         slug: { equals: category },
    //         parent: { exists: false },
    //     },
    // });

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({category}));

    // if (result.docs.length === 0) {
    //     notFound();
    // }

    return (
        <div>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<ProductListSkeleton />}>

                    <ProductList category={category} />
                </Suspense>
            </HydrationBoundary>
        </div>
    );
};

export default Page;