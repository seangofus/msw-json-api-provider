import { RestHandler, rest } from "msw";

import { Serializer } from "../data/Serializer";

export const getOneHandler = (
  path: string,
  dataContext,
  responseDelay: number
): RestHandler =>
  rest.get(path, (req, res, ctx) => {
    const { id } = req.params;
    const data = dataContext.findOne(id);
    const serializer = new Serializer(data);

    return res(
      ctx.status(200),
      ctx.json(serializer.serialize()),
      ctx.delay(responseDelay)
    );
  });
