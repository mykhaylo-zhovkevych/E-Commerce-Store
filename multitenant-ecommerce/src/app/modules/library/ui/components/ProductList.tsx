"use client"

import {useTRPC} from "@/trpc/client";
import {useSuspenseInfiniteQuery} from "@tanstack/react-query";
import {DEFAULT_LIMIT} from "@/constants/constants";
import {ProductCard, ProductCardSkeleton} from "@/app/modules/library/ui/components/ProductCard";

export const ProductList = () => {
    const trpc = useTRPC();
    const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useSuspenseInfiniteQuery(
        trpc.library.getMany.infiniteQueryOptions(
            {limit: DEFAULT_LIMIT},
            {getNextPageParam: (lastPage) => lastPage.docs.length > 0 ? lastPage.nextPage : undefined},
        )
    );

    const docs = data.pages.flatMap((page) => page.docs);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {docs.map((product) => (
                <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    imageUrl={product.image?.url ?? null}
                    tenantSlug={product.tenant.slug}
                    tenantImageUrl={product.tenant?.image?.url}
                    reviewRating={0}
                    reviewCount={0}
                    tags={product.tags}
                />
            ))}
        </div>
    );
};

export const ProductListSkeleton = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: DEFAULT_LIMIT }).map((_, i) => (
                <ProductCardSkeleton key={i} /> ))}
        </div>
    );
};
