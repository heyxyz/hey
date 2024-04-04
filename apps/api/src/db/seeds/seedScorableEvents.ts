import { prisma } from '../seed';

const seedScorableEvents = async (): Promise<number> => {
  await prisma.scorableEvent.create({
    data: { eventType: 'LIKE', points: 10 }
  });

  return 1;
};

export default seedScorableEvents;
