import { GraphQLError } from "graphql";

export type ErrorCode = "NOT_FOUND" | "BAD_USER_INPUT" | "INTERNAL";

//researched never type: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-never-type
// This function throws a GraphQLError with a specific message and code, and is typed to never return (it always throws).
export function gqlError(message: string, code: ErrorCode): never {
  throw new GraphQLError(message, { extensions: { code } });
}

// I had it setup us an entity inc case we want to use it for more models.
export function notFound(entity: string, id: string): never {
  gqlError(`${entity} ${id} not found`, "NOT_FOUND");
}
