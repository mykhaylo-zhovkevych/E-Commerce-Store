"use client";

import {Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Button} from "@/components/ui/button";
import {getCategoriesHref} from "@/app/modules/home/ui/components/search-filters/hooks/category-navigation";
import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";

import Link from "next/link";
import React from "react";

export function CategoriesSideBarRight() {
    const [isSidebarOpen, setSidebarOpen] = React.useState(false);

    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());

    return (
        <>
            <Button variant='link' className='p-8 rounded-md' onClick={() => setSidebarOpen(true)}>
                Categories
            </Button>
            <Sheet open={isSidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetContent side="top" className="p-0 transition-none">
                    <SheetHeader className="p-4 border-b">
                        <div>
                            <SheetTitle>
                                Catalog
                            </SheetTitle>
                        </div>
                    </SheetHeader>
                    <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
                        {data.map((category) => (
                            <Link
                                key={category.id}
                                onClick={() => setSidebarOpen(false)}
                                href={getCategoriesHref(category.slug)}
                                className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
                            >
                                {category.alt}
                            </Link>
                        ))}
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </>
    )
}
