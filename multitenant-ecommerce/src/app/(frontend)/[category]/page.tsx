import {Suspense} from "react";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import {caller, getQueryClient, trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {ProductList,ProductListSkeleton} from "@/app/modules/products/ui/components/ProductList";
import {cn} from "@/lib/utils";
import ProductFilter from "@/app/modules/products/ui/components/ProdectFilter";

const Page = async ({params}: {
        params: Promise<{ category: string }>;
}) => {
    const { category } = await params;
    // const payload = await getPayload({ config });
    //
    //
    //
    // const result = await payload.find({
    //     collection: "categories",
    //     limit: 1,
    //     where: {
    //         slug: { equals: category },
    //         parent: { exists: false },
    //     },
    // });

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({category}));

    // if (result.docs.length === 0) {
    //     notFound();
    // }

    return (
        <div>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <div className="px-4 lg:px-12 py-8 flex flex-col gap-6">
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