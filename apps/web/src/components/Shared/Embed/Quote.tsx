import QuotedPost from "@components/Post/QuotedPost";
import type { PrimaryPublication } from "@hey/lens";
import type { FC } from "react";
import Wrapper from "./Wrapper";

interface QuoteProps {
  post: PrimaryPublication;
}

const Quote: FC<QuoteProps> = ({ post }) => {
  if (!post) {
    return null;
  }

  return (
    <Wrapper zeroPadding>
      <QuotedPost post={post} />
    </Wrapper>
  );
};

export default Quote;
