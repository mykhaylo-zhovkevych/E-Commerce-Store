"use client"

import Image from "next/image";
import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";

interface PVTProps {
    productId: string;
    tenantSlug: string;
};

export const ProductViewTenant = ({ productId, tenantSlug }: PVTProps) => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.products.getOne.queryOptions({id: productId}));


    return (
        <div className="px-4 lg:px-12 py-10">
            <div className="border rounded-sm bg-white overflow-hidden">
                <div className="relative aspect-[3.9] border-b">
                    <Image src={data.image?.url || "/placeholder.png"}
                           alt={data.name}
                           fill className="object-cover"
                    />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-6">
                    <div className="p-6">
                        <h2 className="text-4xl font-medium">{data.name}</h2>
                    </div>
                </div>
            </div>
        </div>
    )
}