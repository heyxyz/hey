import type { FC, ReactNode } from "react";

import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import { Card } from "@hey/ui";
import cn from "@hey/ui/cn";

interface WrapperProps {
  children: ReactNode;
  className?: string;
  zeroPadding?: boolean;
}

const Wrapper: FC<WrapperProps> = ({
  children,
  className = "",
  zeroPadding = false
}) => (
  <Card
    className={cn("mt-3 cursor-auto", className, { "p-5": !zeroPadding })}
    forceRounded
    onClick={stopEventPropagation}
  >
    {children}
  </Card>
);

export default Wrapper;
