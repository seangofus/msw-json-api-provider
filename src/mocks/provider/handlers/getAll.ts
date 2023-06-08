import { RestHandler, rest } from "msw";

export const getAllHandler = (
  path: string,
  dataContext,
  responseDelay: number
): RestHandler =>
  rest.get(path, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(dataContext.findAll(path)),
      ctx.delay(responseDelay)
    );
  });
