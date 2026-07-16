"use client";

import { CategoryDropdown } from "@/app/(frontend)/search-filters/CategoryDropdown";
import { usePathname } from "next/navigation";
import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";


export const Categories = () => {
    const pathname = usePathname();
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());

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
