import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import logger from '@hey/lib/logger';

const sesClient = new SESClient({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  },
  region: 'eu-west-2'
});

const sendEmail = async ({
  body,
  recipient,
  subject
}: {
  body: string;
  recipient: string;
  subject: string;
}) => {
  const params = {
    Destination: { ToAddresses: [recipient] },
    Message: {
      Body: { Html: { Charset: 'UTF-8', Data: body } },
      Subject: { Charset: 'UTF-8', Data: subject }
    },
    Source: 'no-reply@hey.xyz'
  };

  try {
    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);

    return logger.info(
      `Email sent to ${recipient} via SES - ${response.MessageId}`
    );
  } catch (error) {
    return logger.error(error as any);
  }
};

export default sendEmail;
