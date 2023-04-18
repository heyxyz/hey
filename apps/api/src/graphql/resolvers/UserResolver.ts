import isAuthenticated from '@gql/middlewares/isAuthenticated';
import { db } from '@lib/prisma';

import { builder } from '../builder';

builder.prismaObject('User', {
  findUnique: (user) => ({ id: user.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    address: t.exposeString('address')
  })
});

const UserRequest = builder.inputType('UserRequest', {
  fields: (t) => ({
    id: t.string({ required: true })
  })
});

builder.queryField('user', (t) =>
  t.prismaField({
    type: 'User',
    args: {
      request: t.arg({ type: UserRequest })
    },
    resolve: (query, _root, { request }) => {
      return db.user.findFirst({
        ...query,
        where: { id: request.id },
        rejectOnNotFound: true
      });
    }
  })
);

const CreateUserRequest = builder.inputType('CreateUserRequest', {
  fields: (t) => ({
    id: t.string({ required: true }),
    address: t.string({ required: true })
  })
});

builder.mutationField('createUser', (t) =>
  t.prismaField({
    type: 'User',
    args: {
      request: t.arg({ type: CreateUserRequest })
    },
    resolve: async (query, _root, { request }, context) => {
      await isAuthenticated(context);
      return db.user.create({
        ...query,
        data: {
          id: request.id,
          address: request.address
        }
      });
    }
  })
);
