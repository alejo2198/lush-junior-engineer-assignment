import SchemaBuilder from "@pothos/core";
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
  plugins: [],
});

builder.addScalarType("DateTime", DateTimeResolver, {});

export default builder;
