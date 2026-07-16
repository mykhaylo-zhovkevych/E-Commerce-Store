"use client"

import { useQuery} from "@tanstack/react-query";
import { useTRPC} from "@/trpc/client";


export default function Home() {
    const trpc = useTRPC();

    const { data, isPending, error } = useQuery(
        trpc.categories.getMany.queryOptions()
    );

    if (isPending) return <div>Loading...</div>;
    if (error) return <div>Something is went wrong</div>;

    // const queryClient = getQueryClient();
    // const categories = await queryClient.fetchQuery(trpc.categories.getMany.queryOptions())

    return (
        <pre>
            {JSON.stringify(data, null, 2)}
        </pre>
    )
}
