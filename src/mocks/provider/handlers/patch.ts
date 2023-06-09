import { RestHandler, rest } from "msw";

import { Deserializer } from "../data/Deserializer";
import { Serializer } from "../data/Serializer";

export const patchHandler = (
  path: string,
  dataContext,
  responseDelay: number
): RestHandler =>
  rest.patch(path, async (req, res, ctx) => {
    const { id } = req.params;
    const existingData = dataContext.findOne(id);
    if (!existingData) {
      ctx.status(404),
        ctx.json({ error: "Entity Not Found" }),
        ctx.delay(responseDelay);
    }

    console.log(existingData);
    const jsonData = await req.json();
    console.log(jsonData);
    const deserializer = new Deserializer(jsonData);
    const data = await deserializer.deserialize();
    console.log(data);

    const entity = { ...existingData, ...data };
    console.log(entity);
    const savedData = dataContext.persist(path, entity, "EDIT");
    const serializer = new Serializer(savedData);
    const serializedData = serializer.serialize();

    return res(
      ctx.status(200),
      ctx.json(serializedData),
      ctx.delay(responseDelay)
    );
  });
