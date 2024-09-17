import type { FC, ReactNode } from "react";

import { H5 } from "./Typography";

interface CardHeaderProps {
  body?: ReactNode;
  hideDivider?: boolean;
  title: ReactNode;
}

const CardHeader: FC<CardHeaderProps> = ({
  body,
  hideDivider = false,
  title
}) => {
  return (
    <>
      <div className="m-5 space-y-2">
        <H5>{title}</H5>
        {body ? <p>{body}</p> : null}
      </div>
      {hideDivider ? null : <div className="divider" />}
    </>
  );
};

export default CardHeader;
