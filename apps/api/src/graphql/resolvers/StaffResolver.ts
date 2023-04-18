import getAddressFromJwt from '@gql/helpers/getAddressFromJwt';
import isAuthenticated from '@gql/middlewares/isAuthenticated';
import isStaff from '@gql/middlewares/isStaff';
import isSuperStaff from '@gql/middlewares/isSuperStaff';
import { db } from '@lib/prisma';

import { builder } from '../builder';

builder.prismaObject('Staff', {
  findUnique: (staff) => ({ id: staff.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    user: t.relation('user'),
    staffMode: t.exposeBoolean('staffMode')
  })
});

const MakeStaffRequest = builder.inputType('MakeStaffRequest', {
  fields: (t) => ({
    id: t.string({ required: true })
  })
});

builder.mutationField('makeStaff', (t) =>
  t.prismaField({
    type: 'Staff',
    args: {
      request: t.arg({ type: MakeStaffRequest })
    },
    resolve: async (query, _root, { request }, context) => {
      await isAuthenticated(context);
      await isStaff(request.id);
      isSuperStaff(getAddressFromJwt(context));

      return db.staff.create({
        ...query,
        data: {
          user: { connect: { id: request.id } },
          staffMode: true
        }
      });
    }
  })
);

const RemoveStaffRequest = builder.inputType('RemoveStaffRequest', {
  fields: (t) => ({
    id: t.string({ required: true })
  })
});

builder.mutationField('removeStaff', (t) =>
  t.prismaField({
    type: 'Staff',
    args: {
      request: t.arg({ type: RemoveStaffRequest })
    },
    resolve: async (query, _root, { request }, context) => {
      await isAuthenticated(context);
      await isStaff(request.id);
      isSuperStaff(getAddressFromJwt(context));
      const data = await db.staff.findFirstOrThrow({
        select: { id: true },
        where: { user: { id: request.id } }
      });

      return db.staff.delete({
        ...query,
        where: { id: data?.id }
      });
    }
  })
);

const ToggleStaffModeRequest = builder.inputType('ToggleStaffModeRequest', {
  fields: (t) => ({
    id: t.string({ required: true }),
    enabled: t.boolean({ required: true })
  })
});

builder.mutationField('toggleStaffMode', (t) =>
  t.prismaField({
    type: 'Staff',
    args: {
      request: t.arg({ type: ToggleStaffModeRequest })
    },
    resolve: async (query, _root, { request }, context) => {
      await isAuthenticated(context);
      await isStaff(request.id);

      return db.staff.update({
        ...query,
        where: { id: request.id },
        data: { staffMode: request.enabled }
      });
    }
  })
);
