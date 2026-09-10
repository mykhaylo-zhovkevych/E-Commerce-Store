import type { ProductsGetManyOutput } from "@/app/modules/products/types";
import { ProductCard } from "@/app/modules/products/ui/components/product-card";
import { Button } from "@/components/ui/button";

interface ProductGridProps {
    docs: ProductsGetManyOutput["docs"];
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    onLoadMore: () => void;
}

export const ProductGrid = ({
    docs,
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
}: ProductGridProps) => {
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
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
                        price={0}
                    />
                ))}
            </div>

            <div className="flex justify-center pt-8">
                {hasNextPage && (
                    <Button
                        disabled={isFetchingNextPage}
                        onClick={onLoadMore}
                        className="font-medium"
                    >
                        Load More
                    </Button>
                )}
            </div>
        </>
    );
};
