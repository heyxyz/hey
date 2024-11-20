import prisma from "@hey/db/prisma/db/client";
import logger from "@hey/helpers/logger";
import sendEmail from "./sendEmail";

const sendEmailToAccount = async ({
  id,
  body,
  subject
}: {
  id: string;
  body: string;
  subject: string;
}) => {
  try {
    const foundEmail = await prisma.email.findUnique({ where: { id } });

    if (!foundEmail?.email) {
      return logger.error(`sendEmailToAccount: Email not found for ${id}`);
    }

    await sendEmail({
      body,
      recipient: foundEmail?.email,
      subject
    });

    return logger.info(
      `sendEmailToAccount: Email sent to ${foundEmail?.email} - ${id}`
    );
  } catch (error) {
    return logger.error(error as any);
  }
};

export default sendEmailToAccount;
