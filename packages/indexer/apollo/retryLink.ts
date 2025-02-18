import { RetryLink } from "@apollo/client/link/retry";

// RetryLink is a link that retries requests based on the status code returned.
const retryLink = new RetryLink({
  attempts: { max: 3, retryIf: (error) => Boolean(error) },
  delay: { initial: 200, max: Number.POSITIVE_INFINITY, jitter: true }
});

export default retryLink;
