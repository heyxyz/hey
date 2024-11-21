import { RetryLink } from "@apollo/client/link/retry";

// RetryLink is a link that retries requests based on the status code returned.
const retryLink = new RetryLink({
  attempts: { max: 2, retryIf: (error) => Boolean(error) },
  delay: { initial: 100 }
});

export default retryLink;
