// @ts-nocheck
import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
// eslint-disable-next-line no-restricted-imports
import type { AppRouter as _AppRouter } from "@{{GB_APP_ID}}/core/router";
import { config } from "./config/config.js";

// This type-only AppRouter is safe to import anywhere throughout ui code.
// AppRouter from "@{{GB_APP_ID}}/core/app-router" without type prefix could import
// server code so beware
export type AppRouter = _AppRouter;
export const trpc = createTRPCReact<AppRouter>();
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: config.apiUrl + "/trpc",
      fetch: (input, init) => fetch(input, { ...init, mode: "cors" }),
    }),
  ],
});
