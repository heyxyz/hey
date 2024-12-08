import { TEST_LENS_ID } from "@hey/data/constants";
import prisma from "../client";

const seedEmails = async (): Promise<number> => {
  // Delete all emails
  await prisma.email.deleteMany();

  // Seed emails
  const emails = await prisma.email.createMany({
    data: [
      { accountAddress: TEST_LENS_ID, email: "test@hey.xyz", verified: true },
      { accountAddress: "0x0d", email: "hey@yoginth.com", verified: true }
    ]
  });

  return emails.count;
};

export default seedEmails;
