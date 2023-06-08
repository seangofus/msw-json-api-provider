import { parse } from "yaml";
import { Model } from "./data/Model";
import { RestHandler } from "msw";
import { getHandler } from "./handlers";
import { Context } from "./data/Context";

type Config = {
  defaultModelSize?: number;
  responseDelay?: number;
};

export class Provider {
  private rawDoc: Record<string, any> = {};
  public store: Record<string, Record<string, any>[]> = {};

  constructor(
    private docPath: string,
    private config: Config = { defaultModelSize: 10, responseDelay: 0 }
  ) {}

  public async setup() {
    console.log("setup");

    try {
      const doc = await fetch(this.docPath);
      const text = await doc.text();
      this.rawDoc = parse(text);

      this.setupStore();
      console.log(this.store);
      return this;
    } catch (e) {
      throw new Error("Failed to load OpenAPI document");
    }
  }

  public getHandlers() {
    const handlers: RestHandler[] = [];
    const dataContext = new Context(this.store);
    Object.keys(this.rawDoc.paths).forEach((path) => {
      console.log(this.rawDoc.paths[path]);
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
  }
}
