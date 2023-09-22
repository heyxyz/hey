import QuotedPublication from '@components/Publication/QuotedPublication';
import { Quote } from '@lenster/lens';
import type { FC } from 'react';

import Wrapper from './Wrapper';

interface QuoteProps {
  publication: Quote;
}

const Quote: FC<QuoteProps> = ({ publication }) => {
  return (
    <Wrapper zeroPadding>
      <QuotedPublication publication={publication} />
    </Wrapper>
  );
};

export default Quote;
