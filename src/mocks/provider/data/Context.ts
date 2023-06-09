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

  public persist(
    path: string,
    data: any,
    action: "CREATE" | "EDIT" = "CREATE"
  ) {
    let dataSection = path;
    if (action === "EDIT") {
      dataSection = path.substring(0, path.lastIndexOf("/"));
    }

    if (!this.store[dataSection]) {
      this.store[dataSection] = [];
    }

    if (action === "CREATE") {
      data.id = uuidv4();
      data.createdAt = new Date().toISOString();
      data.createdBy = "john.doe@sample.com";
      data.updatedBy = "john.doe@sample.com";
    }

    data.updatedAt = new Date().toISOString();

    if (action === "EDIT") {
      const filteredData = this.store[dataSection].filter(
        (item) => item.id !== data.id
      );
      this.store[dataSection] = [...filteredData];
    }

    this.store[dataSection].push(data);
    return data;
  }

  public update(path: string, id: string, data: any) {
    const dataSection = path.substring(0, path.lastIndexOf("/"));
    const dataToUpdate = this.store[dataSection].find((item) => item.id === id);
    if (!dataToUpdate) {
      return null;
    }
  }

  public remove(path: string, id: string) {
    const dataSection = path.substring(0, path.lastIndexOf("/"));
    const data = this.store[dataSection];
    const filtered = data.filter((item) => item.id !== id);
    this.store[dataSection] = [...filtered];
    return true;
  }
}
