// src/mocks/browser.js
import { setupWorker, rest } from "msw";


const testHandlers = [
  rest.get("/v1/songs", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ test: "hello" }), ctx.delay(2000));
  }),
];
// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...testHandlers);


