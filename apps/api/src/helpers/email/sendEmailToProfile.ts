import prisma from "@hey/db/prisma/db/client";
import logger from "@hey/helpers/logger";
import sendEmail from "./sendEmail";

const sendEmailToProfile = async ({
  id,
  body,
  subject
}: {
  id: string;
  body: string;
  subject: string;
}) => {
  try {
    const result = await prisma.email.findUnique({ where: { id } });

    if (!result?.email) {
      return logger.error(`sendEmailToProfile: Email not found for ${id}`);
    }

    await sendEmail({
      body,
      recipient: result?.email,
      subject
    });

    return logger.info(
      `sendEmailToProfile: Email sent to ${result?.email} - ${id}`
    );
  } catch (error) {
    return logger.error(error as any);
  }
};

export default sendEmailToProfile;
