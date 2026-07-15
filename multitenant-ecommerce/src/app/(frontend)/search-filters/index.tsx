import { SearchInput } from "./SearchInput";
import { Categories } from "./Categories";
import {CategoryCustome} from "@/app/(frontend)/types";


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
