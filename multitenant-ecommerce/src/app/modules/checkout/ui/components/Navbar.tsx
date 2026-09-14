"use client";
import Link from "next/link";

import {generateTenantURL} from "@/lib/utils";
import {Button} from "@/components/ui/button";

interface NProps {
    slug: string;
}

export const Navbar = ( {slug}: NProps) => {
    return (
        <nav className="h-20 border-b font-medium bg-white">
            <div className="max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12">
                <p className="text-xl">Checkout</p>
                <Button variant="elevated" asChild={true}>
                    <Link href={generateTenantURL(slug)}>Continue Shopping</Link>
                </Button>
            </div>
        </nav>
    );
};

// export const NavbarSkeleton = () => {
//     return (
//         <nav className="h-20 border-b font-medium bg-white bg-white">
//             <div className="max-w(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12">
//                 <div />
//                 <Button disabled={true} className="bg-white" />
//                 <Button className="text-black">
//                     <ShoppingCartIcon />
//                 </Button>
//             </div>
//         </nav>
//     )
// }