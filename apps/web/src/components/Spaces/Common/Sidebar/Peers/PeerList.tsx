// Utils
import clsx from 'clsx';
import React from 'react';

// Assets
import { PeerListIcons } from '../../assets/Icons';

type PeerListProps = {
  count?: number | string;
  className?: string;
  title: string;
  children: React.ReactNode;
};

const PeerList: React.FC<PeerListProps> = ({
  className,
  children,
  title,
  count
}) => {
  const TitleArr = ['Speakers', 'Listeners', 'Requested to Speak'];

  return (
    <div className={clsx(className)}>
      <div className="flex h-full items-center gap-4 overflow-y-auto">
        <div className="h-[1px] flex-1 translate-y-2 bg-slate-800" />
        <div className="relative mt-4 flex items-center justify-center gap-1 text-xs font-medium text-slate-300">
          {title}
          {TitleArr.includes(title) && <span>- {count}</span>}
          <span>{PeerListIcons.info}</span>
        </div>
        <div className="h-[1px] flex-1 translate-y-2 bg-slate-800" />
      </div>
      {children}
    </div>
  );
};
export default React.memo(PeerList);
