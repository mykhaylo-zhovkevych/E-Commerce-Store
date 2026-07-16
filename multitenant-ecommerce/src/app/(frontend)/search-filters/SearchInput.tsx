import {SearchIcon} from "lucide-react";

import {Input} from "@/components/ui/input";
import {CategoryCustome} from "@/app/(frontend)/types";

interface Props {
    disabled?: boolean;
};

export const SearchInput = ({
    disabled
}: Props) => {
    return (
        <div className="flex gap-2 w-full ">
            <div className="relative w-full">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
                <Input className='pl-8 p-8' placeholder="Search products" disabled={disabled}></Input>
            </div>
        </div>
    )
}
