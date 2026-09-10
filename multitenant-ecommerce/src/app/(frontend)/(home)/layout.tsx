import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Navbar from "@/app/modules/home/ui/components/Navbar";
import Footer from "@/app/modules/home/ui/components/Footer";
import SearchFilters from "@/app/modules/home/ui/components/search-filters";
import { getQueryClient, trpc } from "@/trpc/server";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());

  return (
    <>
      <Navbar />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<p>Loading...</p>}>
          <SearchFilters />
        </Suspense>
        <main className="flex-1 bg-[#F4F4F0]">{children}</main>
      </HydrationBoundary>
      <Footer />
    </>
  );
}
