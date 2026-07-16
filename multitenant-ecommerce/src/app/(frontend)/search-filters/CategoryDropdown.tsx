"use client"

import { Button } from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {useDropdownPosition} from "@/app/(frontend)/search-filters/use-dropdown-position";
import SubcategoryMenu from "@/app/(frontend)/search-filters/SubcategoryMenu";
import {getCategoriesHref} from "@/app/(frontend)/search-filters/category-navigation";
import type {CategoriesGetManyOutputSingle} from "@/app/modules/categories/types";

import { useRouter } from "next/navigation";
import {useRef, useState} from "react";

interface Props {
    category: CategoriesGetManyOutputSingle;
    isActive?: boolean;
    isNavigationHovered?: boolean;
}

export const CategoryDropdown = ({ category, isActive, isNavigationHovered }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { getDropdownPosition } = useDropdownPosition(dropdownRef);
    const router = useRouter();

    const dropdownPosition = getDropdownPosition();
    // If subcategories length more than 0 return true else set to 0 which is false
    const hasSubcategories = (category.subcategories?.docs?.length ?? 0) > 0;

    const onMouseEnter = () => {
        if (hasSubcategories) {
            setIsOpen(true);
        }
    };

    const onMouseLeave = () => {
        setIsOpen(false);
    }

    const onCategoryClick = () => {
        router.push(getCategoriesHref(category.slug));
    };

    return (
        // Div wrapping the button
        <div className="relative" ref={dropdownRef} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <div className="relative">
                <Button variant='elevated' onClick={onCategoryClick} className={cn("h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white", "hover:border-primary text-back", isActive && "border-black", isActive && !isNavigationHovered && "b-white-primary")}>
                    {category.alt}
                </Button>
                {hasSubcategories && (
                    // upward arrow
                    <div
                        className={cn("opacity-0 absolute -bottom-3 w-0 h-0 border-l-[10px]", "border-r-[10px] border-b-[10px] border-l-transparent border-r-transparent border-b-black", "left-1/2 -translate-x-1/2", isOpen && "opacity-100")}
                    />
                )}
            </div>
            <SubcategoryMenu
                category={category}
                isOpen={isOpen && hasSubcategories}
                position={dropdownPosition}

            />
        </div>
    );
};

export default CategoryDropdown;
