"use client";

import { CategoryDropdown } from "@/app/(frontend)/search-filters/CategoryDropdown";
import { CategoryCustome } from "@/app/(frontend)/types";
import { usePathname } from "next/navigation";


interface Props {
    data: CategoryCustome[];
}

export const Categories = ({ data }: Props) => {
    const pathname = usePathname();
    const activeCategories = data.map((category) => category.slug);

    const activeCategorySlug = activeCategories.find((slug) => pathname.split("/").includes(slug)) ?? "/";

    return (
        <div className="relative w-full">
            <div className="flex flex-wrap gap-2">
                {data.map((category) => (
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
