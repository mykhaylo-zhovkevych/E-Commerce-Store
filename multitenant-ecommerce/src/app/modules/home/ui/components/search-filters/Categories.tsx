"use client";

import { CategoryDropdown } from "@/app/modules/home/ui/components/search-filters/CategoryDropdown";
import type {CategoriesGetManyOutput} from "@/app/modules/categories/types";

interface CategoriesProps {
    categories: CategoriesGetManyOutput;
    activeCategorySlug?: string;
}

export const Categories = ({categories, activeCategorySlug}: CategoriesProps) => {
    return (
        <div className="relative w-full">
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                    <div key={category.id}>
                        <CategoryDropdown
                            category={category}
                            isActive={category.slug === activeCategorySlug}
                            isNavigationHovered={false}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Categories;
