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
      toast.success('Copied to clipboard!');
    }}
  >
    <div className="flex gap-2 items-center font-bold cursor-pointer linkify">
      {icon}
      {title ? <div className="text-sm text-gray-500">{title}:</div> : null}
      <div>{children}</div>
    </div>
  </CopyToClipboard>
);

export default MetaDetails;
