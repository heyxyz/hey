import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import logger from "@hey/helpers/logger";

const sesClient = new SESClient({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  region: "us-west-2"
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
  try {
    const command = new SendEmailCommand({
      Destination: { ToAddresses: [recipient] },
      Message: {
        Body: { Html: { Charset: "UTF-8", Data: body } },
        Subject: { Charset: "UTF-8", Data: subject }
      },
      Source: "no-reply@hey.xyz"
    });
    const response = await sesClient.send(command);

    return logger.info(
      `Email sent to ${recipient} via SES - ${response.MessageId}`
    );
  } catch (error) {
    return logger.error(error as any);
  }
};

export default sendEmail;
