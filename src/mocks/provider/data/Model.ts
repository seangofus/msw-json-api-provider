import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker";

type BaseObject = {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
};

type ModelAttributes = {
  type: string;
  description: string;
  ["x-faker"]?: string | { fake: string };
};

type SchemaItem = {
  ["$ref"]?: string;
  properties?: {
    attributes?: {
      properties?: Record<string, ModelAttributes>;
    };
    relationships?: {
      properties?: Record<string, any>;
    };
  };
};

export class Model {
  private path = "";
  private schemas: Record<string, any> = {};
  private size = 0;
  public model: Record<string, any> = {};

  constructor(path: string, schemas: Record<string, any>, size: number) {
    this.path = path;
    this.schemas = schemas;
    this.size = size;

    this.model = Object.values(this.schemas).filter((schema) => {
      return schema["x-paths"].includes(this.path);
    })[0];

    if (!this.model) {
      throw new Error("Failed to find model");
    }
  }

  public getModels(): Record<string, any>[] {
    const models = [];
    for (let i = 0; i < this.size; i++) {
      let data = {};
      if (this.model["x-type"]) {
        data = {
          ...data,
          type: this.model["x-type"],
        };
      }
      this.model.allOf.forEach((item: SchemaItem) => {
        if (item["$ref"] && item["$ref"].includes("baseObject")) {
          data = { ...data, ...this.getBaseObject() };
        }
        if (item.properties && item.properties.attributes) {
          if (item.properties.attributes.properties) {
            const properties = item.properties.attributes.properties;
            Object.keys(properties).forEach((key) => {
              data = {
                ...data,
                [key]: this.fakeData(properties[key]),
              };
            });
          }
        }
        if (item.properties && item.properties.relationships) {
          if (item.properties.relationships.properties) {
            const relationships = Object.keys(
              item.properties.relationships.properties
            ).reduce((acc, key) => {
              acc[key] = {
                type: item.properties.relationships.properties[key]["$ref"],
                data: [],
              };
              return acc;
            }, {});
            data = { ...data, relationships };
          }
        }
      });
      models.push(data);
    }
    // this.seedRelationships(models);
    return models;
  }

  private getBaseObject(): BaseObject {
    return {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: faker.internet.email().toLowerCase(),
      updatedBy: faker.internet.email().toLowerCase(),
    };
  }

  private fakeData(item: ModelAttributes) {
    if (item["x-faker"]) {
      let fakerFunc = faker;
      if (typeof item["x-faker"] === "string") {
        const fakeArray = item["x-faker"].split(".");
        for (let i = 0; i < fakeArray.length; i++) {
          fakerFunc = fakerFunc[fakeArray[i]];
        }
        return fakerFunc();
      }
      return fakerFunc["fake"](item["x-faker"].fake);
    }

    switch (item.type) {
      case "string":
        return faker.lorem.word();
      case "integer":
        return faker.datatype.number();
      case "boolean":
        return faker.datatype.boolean();
      case "date":
        return faker.date.recent();
      case "datetime":
        return faker.date.recent();
      case "email":
        return faker.internet.email().toLowerCase();
      case "url":
        return faker.internet.url();
      case "uuid":
        return uuidv4();
      default:
        return faker.lorem.word();
    }
  }

  public static seedRelationships(store: Record<string, any>[]) {
    const models = Object.values(store).flat();
    console.log(models);
    models.forEach((model) => {
      if (model.relationships) {
        Object.keys(model.relationships).forEach((key) => {
          const relationship = model.relationships[key];

          if (relationship.type.endsWith("reltoone.yaml")) {
            const oppositeModels = models
              .map((m) => {
                if (m.type.includes(key)) {
                  return m.id;
                }
              })
              .filter((m) => m);

            if (oppositeModels.length > 0) {
              const index = Math.floor(Math.random() * oppositeModels.length);
              const selectedModel = oppositeModels[index];
              model.relationships[key].data.push(selectedModel);

              // This works for to one relationships
              const inverseModel = models.find((m) => m.id === selectedModel);
              if (inverseModel) {
                inverseModel.relationships[model.type].data.push(model.id);
              }
            }
          } else if (relationship.type.endsWith("reltomany.yaml")) {
            // const oppositeModels = models
            //   .map((m) => {
            //     if (m.type.includes(key)) {
            //       return m.id;
            //     }
            //   })
            //   .filter((m) => m);
            // if (oppositeModels.length > 0) {
            //   const numItems =
            //     Math.floor(Math.random() * oppositeModels.length) + 1;
            //   const items = new Set();
            //   for (let i = 0; i < numItems; i++) {
            //     const randomIndex = Math.floor(
            //       Math.random() * oppositeModels.length
            //     );
            //     items.add(oppositeModels[randomIndex]);
            //   }
            //   const relationshipArr = Array.from(items);
            //   model.relationships[key].data.push(...relationshipArr);
            //   // Create reverse relationship
            //   relationshipArr.forEach((id) => {
            //     const inverseModel = models.find((m) => m.id === id);
            //     if (inverseModel) {
            //       inverseModel.relationships[model.type].data.push(model.id);
            //     }
            //   });
            // }
          }
        });
      }
    });
  }
}

//
