import getAddressFromJwt from '@gql/helpers/getAddressFromJwt';
import isProfileOwnByAddress from '@gql/helpers/isProfileOwnByAddress';
import isAuthenticated from '@gql/middlewares/isAuthenticated';
import isStaff from '@gql/middlewares/isStaff';
import { db } from '@lib/prisma';

import { builder } from '../builder';

builder.prismaObject('User', {
  findUnique: (user) => ({ id: user.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    address: t.exposeString('address'),
    isStaff: t.field({
      type: 'Boolean',
      resolve: async (parent) => {
        return await isStaff(parent.id);
      }
    }),
    staffMode: t.field({
      type: 'Boolean',
      resolve: async (parent) => {
        const data = await db.staff.findFirst({
          select: { staffMode: true },
          where: { id: parent.id }
        });

        return data?.staffMode ?? false;
      }
    })
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
    id: t.string({ required: true })
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
      const address = getAddressFromJwt(context);
      await isProfileOwnByAddress(request.id, address);

      try {
        return await db.user.create({
          ...query,
          data: { id: request.id, address }
        });
      } catch (error: any) {
        throw new Error(error.code);
      }
    }
  })
);
