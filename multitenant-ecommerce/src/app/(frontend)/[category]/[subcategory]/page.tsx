import {getQueryClient, trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import ProductListView from "@/app/modules/products/ui/components/views/product-view";
import {loadProductFilters} from "@/app/modules/products/search-params";
import {SearchParams} from "next/dist/server/request/search-params";

const Page = async ({params, searchParams}: {
    params: Promise<{ subcategory: string }>;
    searchParams: Promise<SearchParams>;
}) => {
    const { subcategory } = await params;
    const queryClient = getQueryClient();
    const filters = await loadProductFilters(searchParams);

    // Void just discards the promise since you are not awaiting it, I want it to start now but not block rendering
    void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({category: subcategory, ...filters}));

    return (
        <div>
            <HydrationBoundary state={dehydrate(queryClient)}>
                {/*<Suspense fallback={<ProductListSkeleton />}>*/}

                {/*    <ProductList category={subcategory} />*/}
                {/*</Suspense>*/}
                <ProductListView category={subcategory} />
            </HydrationBoundary>
        </div>
    );
};

export default Page;