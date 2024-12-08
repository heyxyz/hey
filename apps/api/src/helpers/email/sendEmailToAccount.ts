import prisma from "@hey/db/prisma/db/client";
import logger from "@hey/helpers/logger";
import sendEmail from "./sendEmail";

const sendEmailToAccount = async ({
  accountAddress,
  body,
  subject
}: {
  accountAddress: string;
  body: string;
  subject: string;
}) => {
  try {
    const foundEmail = await prisma.email.findUnique({
      where: { accountAddress }
    });

    if (!foundEmail?.email) {
      return logger.error(
        `sendEmailToAccount: Email not found for ${accountAddress}`
      );
    }

    await sendEmail({
      body,
      recipient: foundEmail?.email,
      subject
    });

    return logger.info(
      `sendEmailToAccount: Email sent to ${foundEmail?.email} - ${accountAddress}`
    );
  } catch (error) {
    return logger.error(error as any);
  }
};

export default sendEmailToAccount;
