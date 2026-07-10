import { CategoryDropdown } from "@/app/(frontend)/search-filters/CategoryDropdown";
import {CategoryCustome} from "@/app/(frontend)/search-filters/index";


interface Props {
    data: CategoryCustome[];
}

export const Categories = ({ data }: Props) => {
    return (
        <div className="relative w-full">
            <div className="flex flex-wrap gap-2">
                {data.map((category) => (
                    <div key={category.id}>
                        <CategoryDropdown category={category} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Categories;