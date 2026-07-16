"use client";

import {CategoriesSideBarRight} from "@/app/(frontend)/search-filters/CategoriesSideBarRight";
import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";
import { SearchInput } from "./SearchInput";
import { Categories } from "./Categories";


export const SearchFilters = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());

    // const result = ["apple", "banana"];
    // const [first] = result;

    return (
        <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full " style={{
            backgroundColor: "#F5F5F5"
        }}>
            <div className="flex items-center gap-2 w-full">
                <SearchInput />
                <div className='lg:hidden shrink-0'>
                    <CategoriesSideBarRight />
                </div>
            </div>
            <div className='hidden lg:block'>
                <Categories />
            </div>
        </div>
    );
};


export default SearchFilters;
