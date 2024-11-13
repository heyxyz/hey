import { Card } from "@hey/ui";
import type { FC } from "react";
import PostShimmer from "./PostShimmer";

const PostsShimmer: FC = () => {
  return (
    <Card className="divide-y-[1px] dark:divide-gray-700">
      {Array.from({ length: 3 }).map((_, index) => (
        <PostShimmer key={index} />
      ))}
    </Card>
  );
};

export default PostsShimmer;
