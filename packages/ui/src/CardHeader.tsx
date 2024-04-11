import type { FC, ReactNode } from 'react';

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
        <div className="flex items-center space-x-2">
          <div className="text-lg font-bold">{title}</div>
        </div>
        {body ? <p>{body}</p> : null}
      </div>
      {hideDivider ? null : <div className="divider" />}
    </>
  );
};

export default CardHeader;
