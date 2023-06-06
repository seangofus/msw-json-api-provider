// src/mocks/browser.js
import { setupWorker, rest } from "msw";
import { getHandlers } from "./provider";
import { Provider } from "./provider/Provider";

const testProvider = new Provider("../../reference/Music.yaml", {
  defaultModelSize: 3,
});
await testProvider.setup();

const testHandlers = [
  rest.get("/v1/songs", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ test: "hello" }), ctx.delay(2000));
  }),
];

// const handlers = getHandlers("../../reference/Music.yaml");
// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...testHandlers);
