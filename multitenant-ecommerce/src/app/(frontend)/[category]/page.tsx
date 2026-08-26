import { SearchParams } from "next/dist/server/request/search-params";

import {getQueryClient, trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import { loadProductFilters} from "@/app/modules/products/search-params";
import ProductListView from "@/app/modules/products/ui/components/views/product-view";

const Page = async ({params, searchParams}: {
        params: Promise<{ category: string }>;
        searchParams: Promise<SearchParams>;
}) => {
    const { category } = await params;
    const filters = await loadProductFilters(searchParams);

    console.log(JSON.stringify(filters), "This is from RSC");

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({category, ...filters}));

    // if (result.docs.length === 0) {
    //     notFound();
    // }

    return (
        <div>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <ProductListView category={category} />
            </HydrationBoundary>
        </div>
    );
};

export default Page;