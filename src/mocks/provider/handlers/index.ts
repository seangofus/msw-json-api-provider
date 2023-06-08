import { getAllHandler } from "./getAll";
import { getOneHandler } from "./getOne";

export const getHandler = (
  path: string,
  method: string,
  dataContext,
  delay = 0
) => {
  switch (method) {
    case "get":
      if (path.endsWith("{id}")) {
        const transformedPath = path.replace("{id}", ":id");
        return getOneHandler(transformedPath, dataContext, delay);
      }
      return getAllHandler(path, dataContext, delay);
    default:
      return null;
  }
};
