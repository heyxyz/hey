import QuotedPost from "@components/Post/QuotedPost";
import type { Post } from "@hey/indexer";
import type { FC } from "react";
import Wrapper from "./Wrapper";

interface QuoteProps {
  post: Post;
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
