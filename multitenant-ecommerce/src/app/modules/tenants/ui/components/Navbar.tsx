"use client";
import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import {generateTenantURL} from "@/lib/utils";

interface NProps {
    slug: string;
}

export const Navbar = ( {slug}: NProps) => {
    const trpc = useTRPC();
    // usable prefetched data
    const { data } = useSuspenseQuery(trpc.tenants.getOne.queryOptions({ slug }));

    return (
        <nav className="h-20 border-b font-medium bg-white">
            <div className="max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12">
                <Link className="flex items-center gap-2" href={generateTenantURL(slug)}>
                    {data.image?.url && (
                        <Image className="rounded-full border shrink-0 size-[32px]" src={data.image.url} alt={"image"} width={32} height={32} />
                    )}
                    <p className="text-xl">{data.name}</p>
                </Link>
            </div>
        </nav>
    );
};

export const NavbarSkeleton = () => {
    return (
        <nav className="h-20 border-b font-medium bg-white bg-white">
            <div className="max-w(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12">
                <div />
                {/*TODO: Skeleton for checkout button*/}
            </div>
        </nav>
    )
}