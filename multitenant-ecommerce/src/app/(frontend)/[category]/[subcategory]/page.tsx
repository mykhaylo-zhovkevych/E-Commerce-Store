import {Suspense} from "react";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import {caller, getQueryClient, trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {ProductList,ProductListSkeleton} from "@/app/modules/products/ui/components/product-list";

const Page = async ({params}: {
    params: Promise<{ subcategory: string }>;
}) => {
    const { subcategory } = await params;
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({category: subcategory}));

    return (
        <div>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<ProductListSkeleton />}>

                    <ProductList category={subcategory} />
                </Suspense>
            </HydrationBoundary>
        </div>
    );
};

export default Page;