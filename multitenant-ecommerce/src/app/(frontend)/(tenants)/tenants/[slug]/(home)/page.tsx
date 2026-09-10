import type { SearchParams } from "nuqs/server";

import {getQueryClient, trpc} from "@/trpc/server";
import { DEFAULT_LIMIT} from "@/constants/constants";
import { ProductListView } from "@/app/modules/products/ui/components/views/product-view";
import { loadProductFilters } from "@/app/modules/products/search-params";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";

interface PageProps {
    searchParams: Promise<SearchParams>;
    params: Promise<{ slug: string }>;
};

const TenantPage = async ({ params, searchParams}: PageProps) => {
    const { slug } = await params;
    const filters = await loadProductFilters(searchParams);

    const queryClient = getQueryClient();
    void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions(
        {...filters, tenantSlug: slug, limit: DEFAULT_LIMIT},
        {
            getNextPageParam: (lastPage) => {
                return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
            },
        }
    ));

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductListView tenantSlug={slug} />
        </HydrationBoundary>
    );
}

export default TenantPage;