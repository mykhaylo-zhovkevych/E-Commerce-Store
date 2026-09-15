import CheckoutView from "@/app/modules/checkout/ui/views/CheckoutView";

interface PageProps {
    params: Promise<{slug: string}>;
}

const Page = async ({params}: PageProps) => {
    const {slug} = await params;
    return <CheckoutView tenantSlug={slug}/>
}

export default Page