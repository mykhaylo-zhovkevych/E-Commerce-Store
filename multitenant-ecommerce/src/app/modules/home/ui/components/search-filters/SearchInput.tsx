import {BookmarkCheckIcon, SearchIcon} from "lucide-react";

import {Input} from "@/components/ui/input";
import {useTRPC} from "@/trpc/client";
import {useQuery} from "@tanstack/react-query";
import {Button} from "@/components/ui/button";
import Link from "next/link";


interface Props {
    disabled?: boolean;
};

export const SearchInput = ({
    disabled
}: Props) => {

    const trpc = useTRPC();
    const session = useQuery(trpc.auth.session.queryOptions());

    return (
        <div className="flex gap-2 w-full ">
            <div className="relative w-full">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
                <Input className='pl-8 p-8' placeholder="Search products" disabled={disabled}></Input>
            </div>
                {session.data?.user && <Button variant="outline" className='p-8'>
                        <Link href="/" className="h-full flex items-center">
                            <BookmarkCheckIcon></BookmarkCheckIcon>
                        </Link>
                    </Button>
                }
        </div>
    )
}
