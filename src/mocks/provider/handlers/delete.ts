import { RestHandler, rest } from "msw";

import { Deserializer } from "../data/Deserializer";
import { Serializer } from "../data/Serializer";

export const deleteHandler = (
  path: string,
  dataContext,
  responseDelay: number
): RestHandler =>
  rest.delete(path, async (req, res, ctx) => {
    const { id } = req.params;
    const removed = dataContext.remove(path, id);
    if (!removed) {
      return res(ctx.status(404), ctx.delay(responseDelay));
    }

    return res(ctx.status(204), ctx.delay(responseDelay));
  });
