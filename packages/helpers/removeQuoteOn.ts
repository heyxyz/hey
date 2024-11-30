/**
 * Removes the `quoteOn` property from a Quote object.
 * @param post The Quote object to remove the `quoteOn` property from.
 * @returns The Quote object without the `quoteOn` property.
 */
const removeQuoteOn = (post: Quote): Quote => {
  const { quoteOn, ...rest } = post;

  return rest as Quote;
};

export default removeQuoteOn;
