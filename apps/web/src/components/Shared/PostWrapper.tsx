import type { AnyPublication } from "@hey/lens";
import { useRouter } from "next/router";
import type { FC, ReactNode } from "react";
import { useOptimisticNavigation } from "src/store/non-persisted/useOptimisticNavigation";

interface PostWrapperProps {
  children: ReactNode | ReactNode[];
  className?: string;
  publication: AnyPublication;
}

const PostWrapper: FC<PostWrapperProps> = ({
  children,
  className = "",
  publication
}) => {
  const { preLoadedPublications, setPreLoadedPublications } =
    useOptimisticNavigation();
  const { pathname, push } = useRouter();

  const handleClick = () => {
    if (pathname === "/mod") {
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.toString().length === 0) {
      setPreLoadedPublications([...preLoadedPublications, publication]);
      push(`/posts/${publication.id}`);
    }
  };

  return (
    <article className={className} onClick={handleClick}>
      {children}
    </article>
  );
};

export default PostWrapper;
