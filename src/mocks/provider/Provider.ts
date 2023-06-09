import { parse } from "yaml";
import { Model } from "./data/Model";
import { RestHandler } from "msw";
import { getHandler } from "./handlers";
import { Context } from "./data/Context";

type Config = {
  defaultModelSize?: number;
  responseDelay?: number;
  localStorage?: boolean;
  localStorageKey?: string;
};

export class Provider {
  private rawDoc: Record<string, any> = {};
  public store: Record<string, Record<string, any>[]> = {};
  private config: Config = { defaultModelSize: 10, responseDelay: 0 };
  private localStorageKey: string | undefined;

  constructor(private docPath: string, config: Config = {}) {
    this.config = {
      ...this.config,
      ...config,
    };
    console.log(this.config);
  }

  public async setup() {
    console.log("setup");

    try {
      const doc = await fetch(this.docPath);
      const text = await doc.text();
      this.rawDoc = parse(text);

      //set local storage key
      if (this.config.localStorage) {
        this.localStorageKey = `ae-msw-api-${
          this.config.localStorageKey || "default"
        }-store`.toLowerCase();
      }

      this.setupStore();
      console.log(this.store);
      return this;
    } catch (e) {
      throw new Error("Failed to load OpenAPI document");
    }
  }

  public getHandlers() {
    const handlers: RestHandler[] = [];
    const dataContext = new Context(this.store, {
      localStorage: this.config.localStorage,
      localStorageKey: this.localStorageKey ?? "",
    });
    Object.keys(this.rawDoc.paths).forEach((path) => {
      Object.keys(this.rawDoc.paths[path]).forEach((method) => {
        const handler = getHandler(
          path,
          method,
          dataContext,
          this.config.responseDelay
        );
        if (handler) {
          handlers.push(handler);
        }
      });
    });
    return handlers;
  }

  private setupStore() {
    if (this.config.localStorage) {
      const localStorageData = localStorage.getItem(this.localStorageKey || "");
      if (localStorageData) {
        this.store = JSON.parse(localStorageData);
        return;
      }
    }
    Object.keys(this.rawDoc.paths).forEach((path) => {
      if (!path.includes("{id}")) {
        this.store[path] = [];
        const modelMaker = new Model(
          path,
          this.rawDoc.components.schemas,
          this.config.defaultModelSize
        );
        this.store[path] = [...modelMaker.getModels()];
      }
    });
    Model.seedRelationships(this.store);

    if (this.config.localStorage) {
      localStorage.setItem(
        this.localStorageKey || "",
        JSON.stringify(this.store)
      );
    }
  }
}
