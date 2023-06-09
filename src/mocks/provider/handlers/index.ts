import { deleteHandler } from "./delete";
import { getAllHandler } from "./getAll";
import { getOneHandler } from "./getOne";
import { postHandler } from "./post";

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
    case "post":
      return postHandler(path, dataContext, delay);
    case "delete":
      return deleteHandler(path.replace("{id}", ":id"), dataContext, delay);
    default:
      return null;
  }
};
