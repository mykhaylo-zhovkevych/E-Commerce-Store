import type { Category } from "@/payload-types";
import { SearchInput } from "./SearchInput";
import { Categories } from "./Categories";

export type CategoryCustome = Pick<Category, "alt" | "subcategories">


interface Props {
    categories: CategoryCustome[];
}

export const SearchFilters = ({ categories }: Props) => {
    return (
        <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full">
            <SearchInput />
            <Categories data={categories} />
        </div>
    );
};


export default SearchFilters;
