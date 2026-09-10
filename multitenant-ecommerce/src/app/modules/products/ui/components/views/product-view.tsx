import {Suspense} from "react";
import {ProductSort} from "@/app/modules/products/ui/components/product-sort";
import ProductFilter from "@/app/modules/products/ui/components/ProductFilter";
import {cn} from "@/lib/utils";
import {ProductList, ProductListSkeleton} from "@/app/modules/products/ui/components/ProductList";

interface PLVProps {
    category?: string;
    tenantSlug?: string;
}


export const ProductListView = ({category: cat, tenantSlug}: PLVProps) => (
    <div className="px-4 lg:px-12 py-8 flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:itesm-center gap-y-2 lg:gap-y-0 justify-between">
            <p className="text-2xl font-medium ">
                Curated for you
            </p>
            <ProductSort />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-6 gap-y-6 gap-x-10">
            <div className="lg:col-span-2 xl:col-span-2">
                <ProductFilter>

                </ProductFilter>

            </div>
            <div className={cn("border p-2", "lg:col-span-4 xl:col-span-4")}>
                <Suspense fallback={<ProductListSkeleton />}>
                    <ProductList category={cat} tenantSlug={tenantSlug} />
                </Suspense>
            </div>
        </div>
    </div>
)

export default ProductListView;