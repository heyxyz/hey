import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { emailQueue } from "@hey/db/queue";
import logger from "@hey/helpers/logger";

// Initialize SES Client
const sesClient = new SESClient({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  region: "us-west-2"
});

// Define a job processor for the queue
emailQueue().process(async (job) => {
  const { recipient, subject, body } = job.data;

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
    logger.info(`Email sent to ${recipient} via SES - ${response.MessageId}`);
  } catch (error) {
    logger.error(`Failed to send email to ${recipient}:`, error);
  }
});

// Function to add an email task to the queue
interface SendEmailParams {
  recipient: string;
  subject: string;
  body: string;
}

const sendEmail = async ({ recipient, subject, body }: SendEmailParams) => {
  const { id } = await emailQueue().add({
    recipient,
    subject,
    body
  });
  logger.info(`Email task added to queue for recipient: ${recipient} - ${id}`);
};

export default sendEmail;
