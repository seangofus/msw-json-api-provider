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
}
