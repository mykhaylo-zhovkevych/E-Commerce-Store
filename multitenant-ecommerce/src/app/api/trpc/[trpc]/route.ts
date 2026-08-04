import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createTRPCContext } from '@/trpc/init';
import { appRouter } from '@/trpc/routers/_app';
// In order the client can have possibility for the ability of fetching the backend
// Because the TRPC Backend has direct access to the db, whilst client not
const handler = (req: Request) =>
    fetchRequestHandler({
        endpoint: '/api/trpc',
        req,
        router: appRouter,
        createContext: createTRPCContext,
        onError({ path, error }) {
            console.error(`[tRPC] ${path} failed:`, error);
            console.dir(error.cause, { depth: null });
        },
    });

export { handler as GET, handler as POST };
