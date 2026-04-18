# Lush Junior Engineer Assignment

Task management GraphQL API built with GraphQL Yoga, Pothos, Prisma, PostgreSQL, and Zod.

## Project Summary

This service exposes CRUD-style GraphQL operations for tasks, including:

- Create task
- List tasks
- Get task by ID
- Edit task
- Toggle completion
- Delete task
- Set priority (`LOW`, `MEDIUM`, `HIGH`)

It includes:

- Prisma model + migrations
- Pothos object and enum types
- Zod argument validation through Pothos validation plugin
- Structured GraphQL errors for not-found and internal failures
- `DateTime` scalar integration using `graphql-scalars`

## Tech Stack

- Runtime: Node.js + TypeScript
- API: GraphQL Yoga
- Schema builder: Pothos (`@pothos/core` + `@pothos/plugin-validation`)
- DB access: Prisma Client with Postgres adapter (`@prisma/adapter-pg`)
- Validation: Zod
- Scalars: `graphql-scalars` (`DateTime`)

## Architecture

High-level flow:

1. Yoga receives GraphQL request.
2. Pothos schema resolves query/mutation fields.
3. Zod validation runs on resolver args.
4. Prisma executes DB operations.
5. Errors are raised as `GraphQLError` with extension codes.

Key files:

- `src/main.ts`: HTTP server bootstrapping and Yoga wiring
- `src/context.ts`: Prisma client and GraphQL context
- `src/schema/builder.ts`: Pothos builder and scalar registration
- `src/schema/index.ts`: schema composition entrypoint
- `src/schema/model/task/type.ts`: `Task` object + `Priority` enum
- `src/schema/model/task/query.ts`: task queries
- `src/schema/model/task/mutation.ts`: task mutations
- `src/errors.ts`: shared GraphQL error helpers
- `prisma/schema.prisma`: data model and enum definitions

## Data Model

`Task` fields:

- `id: String` (UUID, primary key)
- `title: String`
- `description: String?`
- `priority: Priority` (default `MEDIUM`)
- `completed: Boolean` (default `false`)
- `createdAt: DateTime`
- `updatedAt: DateTime`

`Priority` enum:

- `LOW`
- `MEDIUM`
- `HIGH`

## API Surface

Queries:

- `task(id: ID!): Task`
- `tasks: [Task!]!`

Mutations:

- `addTask(title: String!, description: String): Task!`
- `toggleTask(id: ID!): Task`
- `deleteTask(id: ID!): Task!`
- `editTask(id: ID!, title: String, description: String): Task`
- `setPriority(id: ID!, priority: Priority!): Task`

## Error Handling Strategy

The service uses centralized helpers in `src/errors.ts`:

- `notFound(entity, id)` -> GraphQL error with code `NOT_FOUND`
- `gqlError(message, code)` -> generic typed GraphQL error generator

Current behavior:

- Missing task IDs throw `NOT_FOUND`.
- Unexpected persistence errors in mutation `try/catch` blocks throw `INTERNAL`.

Example GraphQL error shape:

```json
{
  "errors": [
    {
      "message": "Task <id> not found",
      "extensions": {
        "code": "NOT_FOUND"
      }
    }
  ]
}
```

## Local Setup

### Prerequisites

- Node.js 20+
- PostgreSQL instance
- A valid `DATABASE_URL` in `.env`

### Install

```bash
npm install
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Apply Migrations

```bash
npx prisma migrate deploy
```

For local schema changes during development, use:

```bash
npx prisma migrate dev --name <migration_name>
```

### Run API

```bash
npm run dev
```

GraphQL endpoint:

- `http://localhost:4000/graphql`

## Example Operations

Get by id:

```graphql
query {
  task(id: "<task-id>") {
    id
    title
    description
    priority
    completed
  }
}
```

Create task:

```graphql
mutation {
  addTask(
    title: "Prepare review notes"
    description: "Summarize API decisions"
  ) {
    id
    title
    priority
    completed
    createdAt
  }
}
```

## Migrations Included

- `20260418154830_init_task_table`
- `20260418173538_make_description_optional`
- `20260418190153_add_priority`

## Reviewer Notes

Known gaps / next improvements:

- Add automated tests (unit + integration for resolvers and error cases).

## Scripts

- `npm run dev`: run in watch mode
- `npm run start`: run once
