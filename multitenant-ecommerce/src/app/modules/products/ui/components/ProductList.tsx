"use client";
import { ProductGrid } from "./ProductGrid";
import { EmptyState } from "./EmptyState";

import {useTRPC} from "@/trpc/client";
import {useSuspenseInfiniteQuery} from "@tanstack/react-query";
import type { ProductsGetManyOutput } from "@/app/modules/products/types";
import {useProductFilter} from "@/app/modules/products/search-params";
import {DEFAULT_LIMIT} from "@/constants/constants";


interface Props {
    category?: string;
}

type ProductDoc = ProductsGetManyOutput["docs"][number];

type Status = "empty" | "success";
const getStatus = (docs: ProductDoc[]): Status => (docs.length === 0 ? "empty" : "success");

const renderContent = (docs: ProductDoc[]) => {
    switch (getStatus(docs)) {
        case "empty":
            return <EmptyState />;
        case "success":
            return <ProductGrid docs={docs} />;
    }
};

export const ProductList = ({category}: Props) => {
    const [filters] = useProductFilter();

    const trpc = useTRPC();
    const { data } = useSuspenseInfiniteQuery(trpc.products.getMany.infiniteQueryOptions(
        {...filters, category, limit: DEFAULT_LIMIT},
        {getNextPageParam: (lastPage) => {
                return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
            },
        }
    ));

    const docs = data.pages.flatMap((page) => page.docs);

    return renderContent(docs);
};

export const ProductListSkeleton = () => {
    return (
        <div>
            Loading...
        </div>
    );
};
