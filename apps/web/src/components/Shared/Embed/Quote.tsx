import QuotedPublication from '@components/Publication/QuotedPublication';
import type { PrimaryPublication } from '@hey/lens';
import { type FC, memo } from 'react';

import Wrapper from './Wrapper';

interface QuoteProps {
  publication: PrimaryPublication;
}

const Quote: FC<QuoteProps> = ({ publication }) => {
  if (!publication) {
    return null;
  }

  return (
    <Wrapper zeroPadding>
      <QuotedPublication publication={publication} />
    </Wrapper>
  );
};

export default memo(Quote);
