import {StarIcon } from "lucide-react";
import { cn } from  "@/lib/utils";

const MAX_RATING = 5;

interface SRProps {
    rating: number;
    className?: string;
    iconClassname: string;
    text?: string;
}


export const StarRating= ({
    rating,
    className,
    iconClassname,
    text,
}: SRProps) => {

    const safeRating = Math.max(0, Math.min(rating, MAX_RATING));

    return (
        <div className={cn("flex items-center gap-x-1", className)}>
            {Array.from({ length: MAX_RATING }).map((_, index) => (
                <StarIcon  key={index} className={cn("size-4", index < safeRating ? "fill-black" : "fill-transparent", iconClassname )} />
            ))}
            {text && <p>{text}</p>}
        </div>
    );
};