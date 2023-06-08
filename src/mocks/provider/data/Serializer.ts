import { Serializer as JsonApiSerializer } from "jsonapi-serializer";

export class Serializer {
  private restrictedAttributes = ["id", "type", "relationships"];

  constructor(private data: any) {}

  public serialize() {
    const attributes = this.getAttributes();

    //TODO - add relationships

    return new JsonApiSerializer(this.getType(), {
      attributes,
      keyForAttribute: "camelCase",
    }).serialize(this.data);
  }

  private getType() {
    if (Array.isArray(this.data) && this.data.length > 0) {
      return this.data[0].type;
    } else {
      return this.data.type;
    }
  }

  private getAttributes() {
    let data = null;
    if (Array.isArray(this.data) && this.data.length > 0) {
      data = this.data[0];
    } else {
      data = this.data;
    }

    return Object.keys(data).filter(
      (key) => !this.restrictedAttributes.includes(key)
    );
  }
}
