export class Context {
  constructor(private store: Record<string, Record<string, any>[]>) {}

  public getStore() {
    return this.store;
  }

  public findAll(path: string) {
    return this.store[path];
  }

  public findOne(path: string, id: string) {
    return this.store[path].find((item) => item.id === id);
  }
}
