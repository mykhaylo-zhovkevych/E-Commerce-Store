"use client"

import {useTRPC} from "@/trpc/client";
import {useQuery} from "@tanstack/react-query";

function Page(){
    const trpc = useTRPC();
    const { data } = useQuery(trpc.auth.session.queryOptions());

    return (
        <div>
            {JSON.stringify(data, null, 2)}
        </div>
    );
};

export default Page;