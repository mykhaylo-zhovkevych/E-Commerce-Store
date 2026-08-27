"use client";
import { ProductGrid } from "./ProductGrid";
import { EmptyState } from "./EmptyState";

import {useTRPC} from "@/trpc/client";
import {useSuspenseInfiniteQuery} from "@tanstack/react-query";
import {useProductFilter} from "@/app/modules/products/search-params";
import {DEFAULT_LIMIT} from "@/constants/constants";
import {ProductCardSkeleton} from "@/app/modules/products/ui/components/product-card";


interface Props {
    category?: string;
}

export const ProductList = ({category}: Props) => {
    const [filters] = useProductFilter();

    const trpc = useTRPC();
    const { data,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage
    } = useSuspenseInfiniteQuery(trpc.products.getMany.infiniteQueryOptions(
        {...filters, category, limit: DEFAULT_LIMIT},
        {getNextPageParam: (lastPage) => {
                return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
            },
        }
    ));

    const docs = data.pages.flatMap((page) => page.docs);

    if (docs.length === 0) {
        return <EmptyState />;
    }

    return (
        <ProductGrid
            docs={docs}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={() => fetchNextPage()}
        />
    );
};

// not nice but okay
export const ProductListSkeleton = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: DEFAULT_LIMIT }).map((_, i) => (
                <ProductCardSkeleton key={i} /> ))}
        </div>
    );
};
