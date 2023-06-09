// src/mocks/browser.js
import { setupWorker } from "msw";
import { Provider } from "./provider/Provider";

const jsonApiProviders = new Provider("../../reference/Music.yaml", {
  defaultModelSize: 3,
  localStorage: true,
});
await jsonApiProviders.setup();

const coolHandlers = jsonApiProviders.getHandlers();

export const worker = setupWorker(...coolHandlers);
