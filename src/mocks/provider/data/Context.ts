import { v4 as uuidv4 } from "uuid";

export class Context {
  constructor(private store: Record<string, Record<string, any>[]>) {}

  public getStore() {
    return this.store;
  }

  public findAll(path: string) {
    return this.store[path];
  }

  public findOne(id: string) {
    const data = Object.values(this.store).flat();
    return data.find((item) => item.id === id);
  }

  public persist(path: string, data: any) {
    if (!this.store[path]) {
      this.store[path] = [];
    }

    data.id = uuidv4();
    data.createdAt = new Date().toISOString();
    data.updatedAt = new Date().toISOString();
    data.createdBy = "john.doe@sample.com";
    data.updatedBy = "john.doe@sample.com";

    this.store[path].push(data);
    return data;
  }

  public remove(path: string, id: string) {
    const dataSection = path.substring(0, path.lastIndexOf("/"));
    const data = this.store[dataSection];
    const filtered = data.filter((item) => item.id !== id);
    this.store[dataSection] = [...filtered];
    return true;
  }
}
