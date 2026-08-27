import { SearchParams } from "next/dist/server/request/search-params";

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { loadProductFilters } from "@/app/modules/products/search-params";
import ProductListView from "@/app/modules/products/ui/components/views/product-view";
import { DEFAULT_LIMIT } from "@/constants/constants";

const Page = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
    const filters = await loadProductFilters(searchParams);

    const queryClient = getQueryClient();
    // so the "All" landing page shows every product
    void queryClient.prefetchInfiniteQuery(
        trpc.products.getMany.infiniteQueryOptions(
            { ...filters, limit: DEFAULT_LIMIT },
            {
                getNextPageParam: (lastPage) =>
                    lastPage.docs.length > 0 ? lastPage.nextPage : undefined,
            },
        ),
    );

    return (
        <div>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <ProductListView />
            </HydrationBoundary>
        </div>
    );
};

export default Page;
