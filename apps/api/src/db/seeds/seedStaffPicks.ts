import { prisma } from '../seed';

const seedStaffPicks = async (): Promise<number> => {
  const staffPicks = await prisma.staffPick.createMany({
    data: [
      { id: '0x0d' },
      { id: '0x01' },
      { id: '0x02' },
      { id: '0x03' },
      { id: '0x04' }
    ]
  });

  return staffPicks.count;
};

export default seedStaffPicks;
