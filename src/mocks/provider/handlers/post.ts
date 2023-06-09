import { RestHandler, rest } from "msw";

import { Deserializer } from "../data/Deserializer";
import { Serializer } from "../data/Serializer";

export const postHandler = (
  path: string,
  dataContext,
  responseDelay: number
): RestHandler =>
  rest.post(path, async (req, res, ctx) => {
    const jsonData = await req.json();
    const deserializer = new Deserializer(jsonData);
    const data = await deserializer.deserialize();
    const entity = dataContext.persist(path, data);
    const serializer = new Serializer(entity);
    const serializedData = serializer.serialize();

    return res(
      ctx.status(201),
      ctx.json(serializedData),
      ctx.delay(responseDelay)
    );
  });
