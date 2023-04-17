import './resolvers';

import fs from 'fs';
import type { GraphQLSchema } from 'graphql';
import { lexicographicSortSchema, printSchema } from 'graphql';
import path from 'path';

import { builder } from './builder';

export const schema = builder.toSchema({});

function writeSchema(schema: GraphQLSchema) {
  const schemaAsString = printSchema(lexicographicSortSchema(schema));
  const schemaPath = path.join(process.cwd(), 'src/graphql/schema.graphql');

  const existingSchema = fs.existsSync(schemaPath) && fs.readFileSync(schemaPath, 'utf-8');

  if (existingSchema !== schemaAsString) {
    fs.writeFileSync(schemaPath, schemaAsString);
  }
}

if (process.env.NODE_ENV !== 'production') {
  writeSchema(schema);
}
