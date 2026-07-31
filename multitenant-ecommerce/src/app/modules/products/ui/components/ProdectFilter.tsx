"use client"

import {useState} from "react";
import {ChevronDownIcon, ChevronRightIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {PriceFilter} from "@/app/modules/products/ui/components/helpers/PriceFilter";
import {useProductFilter} from "@/app/modules/products/hooks/use-product-filters";

interface ProductFilterProps {
    title: string;
    className?: string;
    children: React.ReactNode;
}

const ProductFilter = ({title, className, children}: ProductFilterProps) => {
    const [isOpen, setOpen] = useState<boolean>(false);
    const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon;

    return (
        <div className={cn("p-4 border-b flex flex-col gap-2", className)}>
            <div onClick={() => setOpen((current) => !current)} className={cn("flex items-center justify-center, cursor-pointer")}>
                <p className="font-medium">{title}</p>
                <Icon className="size-5" />
            </div>
            {isOpen && children}
        </div>
    )
}

export const ProductFilters = () => {
    const [filters, setFilters] = useProductFilter();

    // Keyof turns object type into a union of its property-name
    const onChange = (key: keyof typeof filters, value: unknown) => {
        setFilters({...filters, [key]: value});
    };

    return (
        <div className="border bg-pink-400">
            <div className="p-4 border-b flex items-center justify-between">
                <span className="font-bold text-xl">Filter</span>
                <br/>
                <Button className="underline" onClick={() =>  {}} type="button">
                    Clear
                </Button>
            </div>
            <ProductFilter title="Price" className="border-b-0">
                <PriceFilter onMinPriceChange={(value) => onChange("minPrice", value)} onMaxPriceChange={(value) => onChange("maxPrice", value)} minPrice={filters.minPrice} maxPrice={filters.maxPrice}  />
            </ProductFilter>
        </div>
    )
}

export default ProductFilters;