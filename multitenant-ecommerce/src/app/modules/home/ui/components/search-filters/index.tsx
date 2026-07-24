"use client";

import {CategoriesSideBarRight} from "@/app/modules/home/ui/components/search-filters/CategoriesSideBarRight";
import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";
import {usePathname} from "next/navigation";
import { SearchInput } from "./SearchInput";
import { Categories } from "./Categories";
import BreadcrumbsNavigation from "./BreadcrumbsNavigation";
import type { Category } from "@/payload-types"


export const SearchFilters = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());
    const pathname = usePathname();

    // Removes empty values form an array
    const [categorySegment, subcategorySegment] = pathname.split("/").filter(Boolean);
    const activeCategory = data.find((category) => category.slug === categorySegment) ?? data.find((category) => category.slug === "/");
    const activeSubcategory = activeCategory?.subcategories?.docs?.find((subcategory): subcategory is Category => (
            typeof subcategory !== "string" && subcategory.slug === subcategorySegment
        ),
    );

    return (
        <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full " style={{
            backgroundColor: activeCategory?.color ?? "#F5F5F5"
        }}>
            <div className="flex items-center gap-2 w-full">
                <SearchInput />
                <div className='lg:hidden shrink-0'>
                    <CategoriesSideBarRight />
                </div>
            </div>
            <div className='hidden lg:block'>
                <Categories
                    categories={data}
                    activeCategorySlug={activeCategory?.slug}
                />
            </div>
            {activeCategory && (
                <BreadcrumbsNavigation
                    categoryAlt={activeCategory.alt}
                    categorySlug={activeCategory.slug}
                    subcategoryAlt={activeSubcategory?.alt}
                />
            )}
        </div>
    );
};

export default SearchFilters;
