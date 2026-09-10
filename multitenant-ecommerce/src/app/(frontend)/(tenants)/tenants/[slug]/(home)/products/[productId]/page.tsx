import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";
import { ProductViewTenant } from "@/app/modules/products/ui/components/views/ProductViewTenant";

interface PLVProps {
    params: Promise<{ productId: string; slug: string }>;
}

const Page = async ({ params }: PLVProps) => {
    const { productId, slug } = await params;

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.products.getOne.queryOptions({ id: productId }));

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<p>Loading...</p>}>
                <ProductViewTenant productId={productId} tenantSlug={slug} />
            </Suspense>
        </HydrationBoundary>
    );
};

export default Page;
