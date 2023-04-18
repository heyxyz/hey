import { db } from '@lib/prisma';

const isStaff = async (id: string) => {
  const data = await db.staff.findFirst({
    select: { user: { select: { id: true } } },
    where: { user: { id } }
  });

  return data?.user.id === id;
};

export default isStaff;
