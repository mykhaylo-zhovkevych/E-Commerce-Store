"use client";
import { ProductGrid } from "./ProductGrid";
import { EmptyState } from "./EmptyState";

import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";
import type { ProductsGetManyOutput } from "@/app/modules/products/types";
import ProductFilter from "@/app/modules/products/ui/components/ProdectFilter";
import {loadProductFilters, useProductFilter} from "@/app/modules/products/hooks/use-product-filters";
import { SearchParams } from "next/dist/server/request/search-params";


interface Props {
    category?: string;
}

type Status = "empty" | "success";
const getStatus = (data: ProductsGetManyOutput): Status => (data.length === 0 ? "empty" : "success");

const renderContent = (data: ProductsGetManyOutput) => {
    switch (getStatus(data)) {
        case "empty":
            return <EmptyState />;
        case "success":
            return <ProductGrid data={data} />;
    }
};

export const ProductList = ({category}: Props) => {
    const [filters] = useProductFilter();

    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.products.getMany.queryOptions({category, ...filters}));

    return renderContent(data);
};

export const ProductListSkeleton = () => {
    return (
        <div>
            Loading...
        </div>
    );
};