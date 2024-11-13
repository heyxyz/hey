import QuotedPost from "@components/Publication/QuotedPost";
import type { PrimaryPublication } from "@hey/lens";
import type { FC } from "react";
import Wrapper from "./Wrapper";

interface QuoteProps {
  publication: PrimaryPublication;
}

const Quote: FC<QuoteProps> = ({ publication }) => {
  if (!publication) {
    return null;
  }

  return (
    <Wrapper zeroPadding>
      <QuotedPost publication={publication} />
    </Wrapper>
  );
};

export default Quote;
