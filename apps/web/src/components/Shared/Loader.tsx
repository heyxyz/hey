import type { FC } from "react";

import { Spinner } from "@hey/ui";
import cn from "@hey/ui/cn";

interface LoaderProps {
  className?: string;
  message?: string;
  small?: boolean;
}

const Loader: FC<LoaderProps> = ({
  className = "",
  message,
  small = false
}) => {
  return (
    <div className={cn("space-y-2 text-center font-bold", className)}>
      <Spinner className="mx-auto" size={small ? "sm" : "md"} />
      {message && <div className={cn({ "text-sm": small })}>{message}</div>}
    </div>
  );
};

export default Loader;
