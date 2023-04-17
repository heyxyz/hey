import { db } from '@lib/prisma';
import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects';
import ValidationPlugin from '@pothos/plugin-validation';
import type { IncomingMessage, OutgoingMessage } from 'http';

export interface Context {
  req: IncomingMessage;
  res: OutgoingMessage;
}

export function createGraphQLContext(req: IncomingMessage, res: OutgoingMessage): Context {
  return { req, res };
}

export const builder = new SchemaBuilder<{
  DefaultInputFieldRequiredness: true;
  PrismaTypes: PrismaTypes;
  Context: Context;
  Scalars: {
    ID: { Input: string; Output: string | number };
    DateTime: { Input: Date; Output: Date };
  };
  AuthScopes: {
    public: boolean;
    user: boolean;
    unauthenticated: boolean;
  };
}>({
  defaultInputFieldRequiredness: true,
  plugins: [SimpleObjectsPlugin, ScopeAuthPlugin, ValidationPlugin, PrismaPlugin],
  authScopes: async ({}) => ({
    public: true,
    user: false,
    unauthenticated: true
  }),
  prisma: { client: db }
});

builder.queryType({
  authScopes: { user: true }
});

// builder.mutationType({
//   authScopes: { user: true }
// });

builder.scalarType('DateTime', {
  serialize: (date) => date.toISOString(),
  parseValue: (date) => {
    if (typeof date !== 'string') {
      throw new Error('Unknown date value.');
    }

    return new Date(date);
  }
});
