import { useCartStore } from "../store/use-card-store"
import { useShallow } from "zustand/react/shallow"

const EMPTY_PRODUCT_IDS: never[] = [];

export const useCart = (tenantSlug: string) => {
    const addProduct = useCartStore((state) => state.addProduct);
    const removeProduct = useCartStore((state) => state.removeProduct);
    const clearCart = useCartStore((state) => state.clearCart);
    const clearAllCarts = useCartStore((state) => state.clearAllCarts);

    // React Compiler sees a changing input and re-derives on every update
    const productIds = useCartStore(useShallow((state) => state.tenantCarts[tenantSlug]?.productIds ?? EMPTY_PRODUCT_IDS));
    // Add or Remove from the active cart, also reactCompiler: true automatically memoizes it
    const toggleProduct = (productId: string) => {
        if (productIds.includes(productId)) {
            removeProduct(tenantSlug, productId);
        } else {
            addProduct(tenantSlug, productId);
        }
    };

    const handleAddProduct = ((prodcutId: string) => {
       addProduct(tenantSlug, prodcutId);
    });

    const handleRemoveProduct = ((prodcutId: string) => {
        removeProduct(tenantSlug, prodcutId);
    });

    // Helpers functions
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
        handleAddProduct,
        handleRemoveProduct,
        totalItemsCount: productIds.length,
    };
};