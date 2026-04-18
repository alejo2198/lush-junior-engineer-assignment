import builder from "./builder";
import "./model/task/type"; // registers Task object type
import "./model/task/query"; // registers queryType
import "./model/task/mutation"; // registers mutationType

export const schema = builder.toSchema();
