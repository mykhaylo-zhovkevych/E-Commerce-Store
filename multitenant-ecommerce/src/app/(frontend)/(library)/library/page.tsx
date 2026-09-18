import LibraryView from "@/app/modules/library/ui/view/LibraryView";
import {getQueryClient, trpc} from "@/trpc/server";
import {DEFAULT_LIMIT} from "@/constants/constants";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";

const Page = async () => {

    const queryClient = getQueryClient();
    void queryClient.prefetchInfiniteQuery(trpc.library.getMany.infiniteQueryOptions({ limit: DEFAULT_LIMIT },
            {
                getNextPageParam: (lastPage) =>
                    lastPage.docs.length > 0 ? lastPage.nextPage : undefined,
            },
        ),
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <LibraryView />
        </HydrationBoundary>
    );
};

export default Page;