import tw from 'twin.macro';

import { Link } from './Link';

export const Header = tw.h1`
 text-4xl font-extrabold mb-8
`;

export const SubHeader = tw.h2`
  text-2xl font-bold mb-4 mt-8
`;

export const Paragraph = tw.p`
  mb-12 max-w-sm text-article
`;

export const PillLink = tw(Link)`
  block text-fg rounded-sm px-1 bg-accentDim hover:bg-accent hover:text-bg dark:hover:text-fg
`;

export const HighlightLink = tw(Link)`
  font-bold hover:text-accent
`;

export const UnderlineLink = tw(HighlightLink)`
  underline
`;
