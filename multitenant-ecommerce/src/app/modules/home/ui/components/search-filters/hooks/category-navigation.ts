export const getCategoriesHref = (categorySlug: string, subcategorySlug?: string) => {
    switch (true) {
        // The seeded "All" category uses the slug "/"; both mean "no filter".
        case (categorySlug === 'all' || categorySlug === '/'): return '/';
        case Boolean(subcategorySlug):
            return `/${categorySlug}/${subcategorySlug}`;
        default:
            return `/${categorySlug}`;
    }
};
