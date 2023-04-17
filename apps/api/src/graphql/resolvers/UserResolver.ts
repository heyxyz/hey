import { db } from '@lib/prisma';

import { builder } from '../builder';

builder.prismaObject('User', {
  findUnique: (user) => ({ id: user.id }),
  fields: (t) => ({
    id: t.exposeID('id', {}),
    address: t.exposeString('address', {})
  })
});

builder.queryField('user', (t) =>
  t.prismaField({
    type: 'User',
    args: { id: t.arg.id({}) },
    resolve: (query, _root, { id }) => {
      return db.user.findFirst({
        ...query,
        where: { id },
        rejectOnNotFound: true
      });
    }
  })
);
