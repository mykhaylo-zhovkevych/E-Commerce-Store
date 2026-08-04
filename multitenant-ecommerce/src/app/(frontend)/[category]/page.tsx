import {Suspense} from "react";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import {caller, getQueryClient, trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {ProductList,ProductListSkeleton} from "@/app/modules/products/ui/components/ProductList";
import {cn} from "@/lib/utils";
import ProductFilter from "@/app/modules/products/ui/components/ProductFilter";
import { SearchParams } from "next/dist/server/request/search-params";
import {loadProductFilters} from "@/app/modules/products/hooks/use-product-filters";


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
                <div className="px-4 lg:px-12 py-8 flex flex-col gap-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:itesm-center gap-y-2 lg:gap-y-0 justify-between">
                        <p className="text-2xl font-medium ">
                            Curated for you
                        </p>
                        <p>
                            Sorting
                        </p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-6 gap-y-6 gap-x-10">
                        <div className="lg:col-span-2 xl:col-span-2">
                            <ProductFilter>

                            </ProductFilter>

                        </div>
                        <div className={cn("border p-2", "lg:col-span-4 xl:col-span-4")}>
                                <Suspense fallback={<ProductListSkeleton />}>

                                    <ProductList category={category} />
                                </Suspense>
                        </div>

                    </div>

                </div>
            </HydrationBoundary>
        </div>
    );
};

export default Page;