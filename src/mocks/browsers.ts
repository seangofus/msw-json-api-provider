// src/mocks/browser.js
import { setupWorker, rest } from "msw";
import { Provider } from "./provider/Provider";

const testProvider = new Provider("../../reference/Music.yaml");
await testProvider.setup();

const coolHandlers = testProvider.getHandlers();

// const handlers = getHandlers("../../reference/Music.yaml");
// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...coolHandlers);
