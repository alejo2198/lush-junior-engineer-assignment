import SchemaBuilder from "@pothos/core";
import ValidationPlugin from "@pothos/plugin-validation";
import { DateTimeResolver } from "graphql-scalars";
import { GraphQLContext } from "../context";
import { Task } from "../../generated/prisma/client";

const builder = new SchemaBuilder<{
  Context: GraphQLContext;
  Scalars: {
    DateTime: { Input: Date; Output: Date };
  };
  Objects: {
    Task: Task;
  };
}>({
  plugins: [ValidationPlugin],
});

builder.addScalarType("DateTime", DateTimeResolver, {});

export default builder;
