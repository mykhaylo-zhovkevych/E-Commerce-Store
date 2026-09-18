import Link from "next/link";
import Image from "next/image";
import { StarIcon } from "lucide-react";

interface PCProps {
    id: string;
    name: string;
    imageUrl?: string | null;
    tenantSlug: string;
    tenantImageUrl?: string | null;
    reviewRating: number;
    reviewCount: number;
    tags: { id: string; name: string }[];
};

export const ProductCard = ({
    id,
    name,
    imageUrl,
    tenantSlug,
    tenantImageUrl,
    reviewRating,
    reviewCount,
    tags,
}: PCProps) => {


    return (
        <Link prefetch href="/library">
            <div className="border rounded-md bg-white overflow-hidden h-full flex flex-col">
                <div className="relative aspect-square">
                    <Image
                        alt={name}
                        fill
                        src={imageUrl || '/auth-bg.png'}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover "
                    />
                </div>
                <div className="p-4 border-y flex flex-col gap-3 flex-1">
                    <h2 className="text-lg font-medium line-clamp-4">
                        {name}
                    </h2>
                    <div className="flex items-center gap-2">
                        {tenantImageUrl && (
                            <Image alt={tenantSlug}
                                   src={tenantImageUrl}
                                   width={16}
                                   height={16}
                                   className="rounded-full border shrink-0 size-[16px] object-cover object-center"
                            />
                        )}
                        <p className="text-sm underline font-medium text-gray-900">
                            {tenantSlug}
                        </p>
                    </div>
                    {reviewCount > 0 && (
                        <div className="flex items-center gap-1">
                            <StarIcon className="size-3.5 fill-black"></StarIcon>
                            <p className="text-sm font-medium">
                                {reviewRating} {(reviewCount)}
                            </p>
                        </div>
                    )}
                </div>
                {tags.length > 0 && (
                    <div className="p-4 flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <span
                                key={tag.id}
                                className="rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-sm font-medium"
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </Link>
    )
};

export const ProductCardSkeleton = () => {
    return (
        <div className=" w-full aspect-3/4 bg-neutral-200 rounded-lg animate-pulse">

        </div>
    );
};
