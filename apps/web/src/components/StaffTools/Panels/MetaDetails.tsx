import { t } from '@lingui/macro';
import type { FC, ReactNode } from 'react';
import { toast } from 'react-hot-toast';

interface MetaDetailsProps {
  children: ReactNode;
  title?: string;
  value: string;
  icon: ReactNode;
}

const MetaDetails: FC<MetaDetailsProps> = ({
  children,
  title,
  value,
  icon
}) => (
  <div
    className="linkify flex cursor-pointer items-center gap-2 font-bold"
    onClick={() => {
      navigator.clipboard.writeText(value);
      toast.success(t`Copied to clipboard!`);
    }}
    aria-hidden="true"
  >
    {icon}
    {title ? <div className="lt-text-gray-500 text-sm">{title}:</div> : null}
    <div>{children}</div>
  </div>
);

export default MetaDetails;
