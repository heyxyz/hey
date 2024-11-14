import type { AnyPublication } from "@hey/lens";
import { useRouter } from "next/router";
import type { FC, ReactNode } from "react";
import { useOptimisticNavigation } from "src/store/non-persisted/useOptimisticNavigation";

interface PostWrapperProps {
  children: ReactNode | ReactNode[];
  className?: string;
  post: AnyPublication;
}

const PostWrapper: FC<PostWrapperProps> = ({
  children,
  className = "",
  post
}) => {
  const { preLoadedPosts, setPreLoadedPosts } = useOptimisticNavigation();
  const { pathname, push } = useRouter();

  const handleClick = () => {
    if (pathname === "/mod") {
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.toString().length === 0) {
      setPreLoadedPosts([...preLoadedPosts, post]);
      push(`/posts/${post.id}`);
    }
  };

  return (
    <article className={className} onClick={handleClick}>
      {children}
    </article>
  );
};

export default PostWrapper;
