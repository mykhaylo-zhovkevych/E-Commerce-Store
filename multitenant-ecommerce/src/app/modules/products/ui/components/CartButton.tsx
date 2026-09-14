import {useCart} from "@/app/modules/checkout/hooks/use-cart";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

interface CBProps {
    tenantSlug: string;
    productId: string;
}

export const CartButton = ({tenantSlug, productId}: CBProps) => {
    const cart = useCart(tenantSlug);

    return (
        <Button variant="elevated" className={cn("flex-1 bg-pink-400", cart.isProductInCart(productId) && "bg-white")}
                onClick={() => cart.toggleProduct(productId)} >
            {
                cart.isProductInCart(productId) ? "Remove Product" : "Add Product"
            }
        </Button>
    );
};