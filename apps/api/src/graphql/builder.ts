import { db } from '@lib/prisma';
import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
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
}>({
  defaultInputFieldRequiredness: true,
  plugins: [SimpleObjectsPlugin, ValidationPlugin, PrismaPlugin],
  prisma: { client: db }
});

builder.queryType();
builder.mutationType();
