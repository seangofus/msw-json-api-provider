import { RestHandler, rest } from "msw";

import { Serializer } from "../data/Serializer";

export const getAllHandler = (
  path: string,
  dataContext,
  responseDelay: number
): RestHandler =>
  rest.get(path, (req, res, ctx) => {
    const data = dataContext.findAll(path);
    const serializer = new Serializer(data);

    return res(
      ctx.status(200),
      ctx.json(serializer.serialize()),
      ctx.delay(responseDelay)
    );
  });
