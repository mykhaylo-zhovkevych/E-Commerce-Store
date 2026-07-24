import Link from "next/link";
import {CategoryCustome} from "@/app/(frontend)/types";
import { getCategoriesHref } from "@/app/modules/home/ui/components/search-filters/hooks/category-navigation";

interface Props {
    category: CategoryCustome;
    isOpen: boolean;
    position: {top: number; left: number};
}

export const SubcategoryMenu = ({
    category, isOpen, position,
}: Props) => {
    const subcategories = category.subcategories?.docs ?? [];

    if (!isOpen || subcategories.length === 0) {
        return null;
    }
    const backgroundColor = category.color || "#e36b6b";

    return (
        <div className="fixed z-100" style={{top:position.top, left: position.left}}>
            <div className="h-3 w-60" />
            <div className="w-60 text-black rounded-md overflow-hidden border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-[-2px] -translate-y-[2px]"
            style={{backgroundColor}}>
                <div>
                    {subcategories.map((subcategory) => {
                        if (typeof subcategory === "string")
                            return null;

                        return (
                            <Link key={subcategory.slug} href={getCategoriesHref(category.slug, subcategory.slug)} className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center font-medium underline">
                                {subcategory.alt}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SubcategoryMenu;
