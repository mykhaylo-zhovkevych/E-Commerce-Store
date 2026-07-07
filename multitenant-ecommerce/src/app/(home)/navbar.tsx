"use client"

import {Poppins} from "next/font/google"
import Link from "next/link";
import {usePathname} from "next/navigation";
import React from "react";
import {MenuIcon} from "lucide-react";

import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {NavbarSidebar} from "@/app/(home)/navbar-sidebar";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["700"],
});

const NavbarItem = ({
    href,
    children,
    isActive
}: NavbarItemProps) => {
    return (
        <Button asChild variant='outline' className={cn("bg-transparent hover:bg-transparent rounded-full hover:border-primary border-transparent", isActive && "bg-black text-white hover:bg-black hover:text-white" )}>
            <Link href={href}>
                {children}
            </Link>
        </Button>
    );
};

// SEO pages
const navbarItems = [
    {
        href: "/", children: "Home",
    },
    {
        href: "/about", children: "About",
    },
    {
        href: "/features", children: "Features",
    },
    {
        href: "/pricing", children: "Pricing",
    },
    {
        href: "/contact", children: "Contact",
    }
]

interface NavbarItemProps {
    href: string;
    children: React.ReactNode;
    isActive?: boolean;
};

export const Navbar = () => {
    const pathname = usePathname()
    const [isSidebarOpen, setSidebarOpen] = React.useState(true);


    return (
        <nav className="h-20 flex border-b justify-between font-medium bg-white">
            <Link href="/" className="flex items-center text-xl">
                <span className={cn("text-black text-5xl font-semibold p-5", poppins.className)}>
                    Link
                </span>
            </Link>

            <NavbarSidebar items={navbarItems} open={isSidebarOpen} onOpenChange={setSidebarOpen} />
            <div className="items-center gap-4 hidden lg:flex">
                {navbarItems.map((item) => (
                    <NavbarItem key={item.href} {...item} isActive={pathname===item.href}>{item.children}</NavbarItem>
                ))}
            </div>
            <div className="hidden lg:flex">
                <Button asChild variant='secondary' className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-white hover:bg-pink-400 transition-colors text-lg">
                    <Link href="/sign-in"> Sign In</Link>
                </Button>
                <Button asChild variant='secondary' className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-black text-white hover:text-black hover:bg-pink-400 transition-colors text-lg">
                    <Link href="/sign-up"> Sign Up</Link>
                </Button>
            </div>

            <div className="flex lg:hidden items-center justify-center">
                <Button variant="ghost" className="size-12 border-transparent bg-white" onClick={() => setSidebarOpen(true)}>
                    <MenuIcon></MenuIcon>
                </Button>
            </div>

        </nav>
    );
};

export default Navbar;
