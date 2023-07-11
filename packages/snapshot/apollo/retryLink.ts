import { RetryLink } from '@apollo/client/link/retry';

// RetryLink is a link that retries requests based on the status code returned.
const retryLink = new RetryLink({
  delay: { initial: 100 },
  attempts: { max: 2, retryIf: (error) => Boolean(error) }
});

export default retryLink;
