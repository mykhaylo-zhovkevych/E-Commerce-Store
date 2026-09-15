import { useCartStore } from "../store/use-card-store"

const EMPTY_PRODUCT_IDS: never[] = [];

export const useCart = (tenantSlug: string) => {
    const addProduct = useCartStore((state) => state.addProduct);
    const removeProduct = useCartStore((state) => state.removeProduct);
    const clearCart = useCartStore((state) => state.clearCart);
    const clearAllCarts = useCartStore((state) => state.clearAllCarts);

    // React Compiler sees a changing input and re-derives on every update
    const productIds = useCartStore(
        (state) => state.tenantCarts[tenantSlug]?.productIds ?? EMPTY_PRODUCT_IDS,
    );

    // Add or Remove from the active cart
    const toggleProduct = (productId: string)=> {
        if (productIds.includes(productId)) {
            removeProduct(tenantSlug, productId);
        }
        else {
            addProduct(tenantSlug, productId);
        }
    };
    const isProductInCart = (productId: string) => {
        return productIds.includes(productId);
    }

    const clearTenantCart = () => {
        clearCart(tenantSlug);
    };

    return {
        productIds,
        addProduct: (productId: string) => addProduct(tenantSlug, productId),
        removeProduct: (productId: string) => removeProduct(tenantSlug, productId),
        clearCart: clearTenantCart,
        clearAllCarts,
        toggleProduct,
        isProductInCart,
        totalItemsCount: productIds.length,
    };
};