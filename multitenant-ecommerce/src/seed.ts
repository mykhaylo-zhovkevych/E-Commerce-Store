import { existsSync } from "node:fs";
import path from "node:path";
import { getPayload } from "payload";
import config from "@payload-config";

type SubcategorySeed = {
    name: string;
    slug: string;
    imagePath?: string;
};

type CategorySeed = {
    name: string;
    slug: string;
    color?: string;
    imagePath?: string;
    subcategories?: SubcategorySeed[];
};

const categories: CategorySeed[] = [
    {
        name: "All",
        slug: "/",
    },
    {
        name: "Business & Money",
        color: "#FFB347",
        slug: "business-money",
        subcategories: [
            { name: "Entrepreneurship", slug: "entrepreneurship" },
            {
                name: "Marketing & Sales",
                slug: "marketing-sales",
            },
            {
                name: "Personal Finance",
                slug: "personal-finance",
            },
        ],
    },
    {
        name: "Technology",
        color: "#4A90E2",
        slug: "technology",
        subcategories: [
            {
                name: "Artificial Intelligence",
                slug: "artificial-intelligence",
            },
            {
                name: "Cybersecurity",
                slug: "cybersecurity",
            },
            {
                name: "Programming",
                slug: "programming",
            },
        ],
    },
    {
        name: "Health & Fitness",
        color: "#50C878",
        slug: "health-fitness",
        subcategories: [
            {
                name: "Exercise",
                slug: "exercise",
            },
            {
                name: "Nutrition",
                slug: "nutrition",
            },
            {
                name: "Mental Health",
                slug: "mental-health",
            },
        ],
    },
    {
        name: "Education",
        color: "#9B59B6",
        slug: "education",
        subcategories: [
            {
                name: "Online Learning",
                slug: "online-learning",
            },
            {
                name: "Languages",
                slug: "languages",
            },
            {
                name: "Career Development",
                slug: "career-development",
            },
        ],
    },
    {
        name: "Arts & Design",
        color: "#E76F51",
        slug: "arts-design",
        subcategories: [
            {
                name: "Graphic Design",
                slug: "graphic-design",
            },
            {
                name: "Illustration",
                slug: "illustration",
            },
            {
                name: "UI & UX Design",
                slug: "ui-ux-design",
            },
        ],
    },
    {
        name: "Lifestyle",
        color: "#F4A261",
        slug: "lifestyle",
        subcategories: [
            {
                name: "Home & Garden",
                slug: "home-garden",
            },
            {
                name: "Relationships",
                slug: "relationships",
            },
            {
                name: "Travel",
                slug: "travel",
            },
        ],
    },
    {
        name: "Music & Audio",
        color: "#8E44AD",
        slug: "music-audio",
        subcategories: [
            {
                name: "Music Production",
                slug: "music-production",
            },
            {
                name: "Instruments",
                slug: "instruments",
            },
            {
                name: "Podcasts",
                slug: "podcasts",
            },
        ],
    },
    {
        name: "Photography & Video",
        color: "#2A9D8F",
        slug: "photography-video",
        subcategories: [
            {
                name: "Photography",
                slug: "photography",
            },
            {
                name: "Video Production",
                slug: "video-production",
            },
            {
                name: "Photo & Video Editing",
                slug: "photo-video-editing",
            },
        ],
    },
    {
        name: "Personal Development",
        color: "#E9C46A",
        slug: "personal-development",
        subcategories: [
            {
                name: "Communication",
                slug: "communication",
            },
            {
                name: "Mindfulness",
                slug: "mindfulness",
            },
            {
                name: "Productivity",
                slug: "productivity",
            },
        ],
    },
];

const tags: string[] = [
    "trending",
    "new-release",
    "bestseller",
    "on-sale",
    "beginner-friendly",
    "advanced",
    "editors-pick",
    "limited-time",
];

const defaultImagePath = path.resolve(process.cwd(), "seed-assets/category-placeholder.avif",);

const resolveImagePath = (): string => {
    const resolvedPath = defaultImagePath;

    if (!existsSync(resolvedPath)) {
        throw new Error(`Seed image does not exist: ${resolvedPath}`);
    }

    return resolvedPath;
};

const seed = async (): Promise<void> => {
    const payload = await getPayload({ config });

    // A tenant can't be created from the admin UI because `stripeAccountId` is
    // required + readOnly (normally set by Stripe onboarding), so seed one here.
    const tenant = await payload.create({
        collection: "tenants",
        // Freshly-dropped collections are (re)created + indexed on first insert.
        // MongoDB rejects that DDL inside a transaction with a WriteConflict
        // ("Collection namespace ... is already in use"), so seed without one.
        disableTransaction: true,
        data: {
            name: "Demo Store",
            slug: "demo",
            stripeAccountId: "test",
            stripeDetailsSubmitted: true,
        },
    });

    await payload.create({
        collection: "users",
        disableTransaction: true,
        data: {
            email: "admin@demo.com",
            password: "demodemo",
            roles: ["super-admin"],
            username: "admin",
            // Attach the tenant so the admin tenant-selector auto-picks it and
            // new products get a tenant without any manual step.
            tenants: [{ tenants: tenant.id }],
        }
    })

    for (const category of categories) {
        console.log(`Creating parent category: ${category.slug}`);

        const parentCategory = await payload.create({
            collection: "categories",
            disableTransaction: true,

            // Required because "categories" is an upload collection
            filePath: resolveImagePath(),

            data: {
                alt: category.name,
                slug: category.slug,
                color: category.color,
                parent: null,
            },
        });

        for (const subcategory of category.subcategories ?? []) {
            console.log(`Creating subcategory: ${subcategory.slug}`);

            await payload.create({
                collection: "categories",
                disableTransaction: true,

                // Every subcategory is also a document in the upload collection
                filePath: resolveImagePath(),

                data: {
                    alt: subcategory.name,
                    slug: subcategory.slug,
                    parent: parentCategory.id,
                },
            });
        }
    }

    for (const tag of tags) {
        console.log(`Creating tag: ${tag}`);

        await payload.create({
            collection: "tags",
            disableTransaction: true,
            data: {
                name: tag,
            },
        });
    }
};

try {
    console.log("Starting seed...");

    await seed();

    console.log("Seed completed successfully.");
    process.exit(0);
} catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
}
