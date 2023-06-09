import { Deserializer as JsonApiDerializer } from "jsonapi-serializer";

export class Deserializer {
  constructor(private data: any) {}

  public deserialize() {
    const type = this.getType();

    return new JsonApiDerializer({
      keyForAttribute: "camelCase",
      transform: (record) => {
        return { type, ...record };
      },
    }).deserialize(this.data);
  }

  private getType() {
    if (Array.isArray(this.data.data) && this.data.data.length > 0) {
      return this.data.data[0].type;
    } else {
      return this.data.data.type;
    }
  }
}
