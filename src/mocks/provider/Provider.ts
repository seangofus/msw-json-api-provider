import { parse } from "yaml";
import { Model } from "./data/model";

type Config = {
  defaultModelSize?: number;
  delay?: number;
};

export class Provider {
  private rawDoc: Record<string, any> = {};
  public store: Record<string, Record<string, any>[]> = {};

  constructor(
    private docPath: string,
    private config: Config = { defaultModelSize: 10, delay: 0 }
  ) {}

  public async setup() {
    console.log("setup");

    try {
      const doc = await fetch(this.docPath);
      const text = await doc.text();
      this.rawDoc = parse(text);

      this.setupStore();
      console.log(this.store);
    } catch (e) {
      throw new Error("Failed to load OpenAPI document");
    }
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
