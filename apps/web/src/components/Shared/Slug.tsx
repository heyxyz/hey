import type { FC } from "react";

import cn from "@hey/ui/cn";

interface SlugProps {
  className?: string;
  prefix?: string;
  slug: string;
  useBrandColor?: boolean;
}

const Slug: FC<SlugProps> = ({
  className = "",
  prefix = "",
  slug,
  useBrandColor = false
}) => {
  return (
    <span
      className={cn(
        useBrandColor ? "text-brand-500" : "ld-text-gray-500",
        className
      )}
    >
      {prefix}
      {slug}
    </span>
  );
};

export default Slug;
