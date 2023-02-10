import { t } from '@lingui/macro';
import type { FC, ReactNode } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import toast from 'react-hot-toast';

interface Props {
  children: ReactNode;
  title?: string;
  value: string;
  icon: ReactNode;
}

const MetaDetails: FC<Props> = ({ children, title, value, icon }) => (
  <CopyToClipboard
    text={value}
    onCopy={() => {
      toast.success(t`Copied to clipboard!`);
    }}
  >
    <div className="linkify flex cursor-pointer items-center gap-2 font-bold">
      {icon}
      {title ? <div className="lt-text-gray-500 text-sm">{title}:</div> : null}
      <div>{children}</div>
    </div>
  </CopyToClipboard>
);

export default MetaDetails;
