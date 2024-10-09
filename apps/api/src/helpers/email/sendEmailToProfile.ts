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
    const data = await prisma.email.findUnique({ where: { id } });

    if (!data?.email) {
      return logger.error(`sendEmailToProfile: Email not found for ${id}`);
    }

    await sendEmail({
      body,
      recipient: data?.email,
      subject
    });

    return logger.info(
      `sendEmailToProfile: Email sent to ${data?.email} - ${id}`
    );
  } catch (error) {
    return logger.error(error as any);
  }
};

export default sendEmailToProfile;
