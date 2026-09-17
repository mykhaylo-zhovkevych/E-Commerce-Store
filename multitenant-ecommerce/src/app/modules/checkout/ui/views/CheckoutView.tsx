"use client";
import {useEffect} from "react";
import {toast} from "sonner";
import {LoaderIcon} from "lucide-react";
import {InboxIcon} from "lucide-react";
import {useRouter} from "next/navigation";

import {useTRPC} from "@/trpc/client";
import {useQuery, useMutation} from "@tanstack/react-query";
import {useCart} from "@/app/modules/checkout/hooks/use-cart";
import {generateTenantURL} from "@/lib/utils";
import {CheckoutItem} from "@/app/modules/checkout/ui/components/CheckoutItem";
import {CheckoutSidebar} from "@/app/modules/checkout/ui/components/CheckoutSidebar";
import {useCheckoutStates} from "@/app/modules/checkout/hooks/use-checkout-states";

interface CVProps {
    tenantSlug: string;
}

const CheckoutView = ({tenantSlug}: CVProps) => {
    const {productIds, clearCart, removeProduct} = useCart(tenantSlug);
    const router = useRouter();
    const trpc = useTRPC();
    const [states, setStates] = useCheckoutStates();
    // Cart ids live in localStorage, so this can only resolve in the browser; useQuery stays idle during SSR.
    const {data, error, isLoading} = useQuery(trpc.checkout.getProducts.queryOptions({
        ids: productIds,
    }));

    const purchase = useMutation(trpc.checkout.purchase.mutationOptions({
        onMutate: () => {
          setStates({ success: false, cancel: false });
        },
        onSuccess: (data) => {
            // eslint-disable-next-line react-hooks/immutability
            window.location.href = data.url;
        },
        onError: (error) => {
            if (error.data?.code === "UNAUTHORIZED") {
                // TODO: Modify when the subdomain are enabled
                router.push("/sign-in");
            }
            toast.error(error.message);
        }
    }));

    useEffect(() => {

        if (states.success) {
            setStates({success: false, cancel: false}).then(r => clearCart());
            router.push("/products");
        }

    }, [states.success, clearCart, router, setStates]);


    useEffect(() => {
        if (!error) return;
        if (error.data?.code === "NOT_FOUND") {
            clearCart();
            toast.warning("Cart has been cleared.");
        }
    }, [error, clearCart])

    if (isLoading || !data) {
        return (
            <div className="lg:pt-16 pt-4 px-4 lg:px-12">
                <div className="border border-black border-dashed flex items-center justify-center p-8
                    flex-col gap-y-4 bg-white w-full rounded-lg">
                        <LoaderIcon className="text-muted-foreground animate-spin" />
                </div>
            </div>
        );
    }

    if (!data || data.docs.length === 0) {
        return (
            <div className="lg:pt-16 pt-4 px-4 lg:px-12">
                <div className="border border-black border-dashed items-center justify-center p-8
                    flex flex-col gap-y-4 bg-white w-full rounded-lg">
                        <InboxIcon />
                    <p className="text-base font-medium text-gray-900">No products found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="lg:pt-16 pt-4 px-4 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
                <div className="lg:col-span-4">
                    <div className="border rounded-md overflow-hidden bg-white">
                        {data.docs.map((product, index) => (
                            <CheckoutItem
                                key={product.id}
                                id={product.id}
                                isLast={index === data.docs.length - 1}
                                imageUrl={product.image?.url}
                                name={product.name}
                                productUrl={`${generateTenantURL(product.tenant.slug)}/products/${product.id}`}
                                tenantUrl={generateTenantURL(product.tenant.slug)}
                                tenantName={product.tenant.name}
                                price={product.price}
                                onRemove={() => removeProduct(product.id)} />
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-3">
                    <CheckoutSidebar
                        total={data.totalPrice}
                        onPurchase={() => purchase.mutate({ tenantSlug, productIds })}
                        isCanceled={states.cancel}
                        disable={purchase.isPending}
                    />
                </div>
            </div>
        </div>
    )
}
export default CheckoutView