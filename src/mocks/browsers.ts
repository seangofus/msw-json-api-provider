// src/mocks/browser.js
import { setupWorker } from "msw";
import { Provider } from "./provider/Provider";

const jsonApiProviders = new Provider("../../reference/Music.yaml");
await jsonApiProviders.setup();

const jsonApiHandlers = jsonApiProviders.getHandlers();

export const worker = setupWorker(...jsonApiHandlers);
