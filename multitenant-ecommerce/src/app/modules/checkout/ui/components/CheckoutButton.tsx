"use client";
import Link from "next/link";
import {ShoppingCartIcon} from "lucide-react";

import {useCart} from "@/app/modules/checkout/hooks/use-cart";
import {cn, generateTenantURL} from "@/lib/utils";
import {Button} from "@/components/ui/button";

interface CBProps {
    className?: string,
    hideIfEmpty?: boolean,
    tenantSlug: string,
}

export const CheckoutButton = ({
    className,
    hideIfEmpty,
    tenantSlug,
}: CBProps) => {
    const { totalItemsCount } = useCart(tenantSlug);
    if (hideIfEmpty && totalItemsCount === 0) return null;

    return <Button variant="elevated" asChild={true} className={cn("bg-white", className)}>
        <Link href={`${generateTenantURL(tenantSlug)}/checkout`}>
            <ShoppingCartIcon /> {totalItemsCount > 0 ? totalItemsCount : ""}
        </Link>
    </Button>
};