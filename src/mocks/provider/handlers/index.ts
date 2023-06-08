import { getAllHandler } from "./getAll";

export const getHandler = (
  path: string,
  method: string,
  dataContext,
  delay = 0
) => {
  switch (method) {
    case "get":
      if (path.endsWith("{id}")) {
        return null;
      }
      return getAllHandler(path, dataContext, delay);
    default:
      return null;
  }
};
