import type { Quote } from "@hey/lens";

/**
 * Removes the `quoteOn` property from a Quote object.
 * @param publication The Quote object to remove the `quoteOn` property from.
 * @returns The Quote object without the `quoteOn` property.
 */
const removeQuoteOn = (publication: Quote): Quote => {
  const { quoteOn, ...rest } = publication;

  return rest as Quote;
};

export default removeQuoteOn;
