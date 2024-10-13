import type { AnyPublication } from "@hey/lens";
import { useRouter } from "next/router";
import type { FC, ReactNode } from "react";

interface PublicationWrapperProps {
  children: ReactNode | ReactNode[];
  className?: string;
  publication: AnyPublication;
}

const PublicationWrapper: FC<PublicationWrapperProps> = ({
  children,
  className = "",
  publication
}) => {
  const { pathname, push } = useRouter();

  const handleClick = () => {
    if (pathname === "/mod") {
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.toString().length === 0) {
      push(`/posts/${publication.id}`);
    }
  };

  return (
    <article className={className} onClick={handleClick}>
      {children}
    </article>
  );
};

export default PublicationWrapper;
