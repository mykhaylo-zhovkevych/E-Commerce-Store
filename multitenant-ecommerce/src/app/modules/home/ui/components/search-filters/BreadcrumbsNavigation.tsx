import Link from "next/link";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Props {
    categoryAlt: string;
    categorySlug: string;
    subcategoryAlt?: string;
}

export const BreadcrumbsNavigation = ({
    categoryAlt,
    categorySlug,
    subcategoryAlt,
}: Props) => {
    if (categorySlug === "/") return null;

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {subcategoryAlt ? (
                    <>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild className="text-xl font-medium underline text-primary">
                                <Link href={`/${categorySlug}`}>{categoryAlt}</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-primary font-medium text-lg">
                            /
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-xl font-medium">
                                {subcategoryAlt}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                ) : (
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-xl font-medium">
                            {categoryAlt}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default BreadcrumbsNavigation;
