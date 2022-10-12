import { PublicationMainFocus } from '@generated/types';
import clsx from 'clsx';
import type { Dispatch, FC } from 'react';

interface Props {
  setFocus: Dispatch<any>;
  focus: string;
}

const FeedType: FC<Props> = ({ setFocus, focus }) => {
  interface FeedLinkProps {
    name: string;
    type?: string;
  }

  const FeedLink: FC<FeedLinkProps> = ({ name, type }) => (
    <button
      type="button"
      onClick={() => {
        setFocus(type);
      }}
      className={clsx(
        { '!bg-brand-500 !text-white': focus === type },
        'text-xs bg-brand-100 rounded-full px-4 py-1.5 text-brand border border-brand-300'
      )}
      aria-label={name}
    >
      {name}
    </button>
  );

  return (
    <div className="flex gap-3 px-5 mt-3 sm:px-0 sm:mt-0">
      <FeedLink name="All posts" />
      <FeedLink name="Text" type={PublicationMainFocus.TextOnly} />
      <FeedLink name="Videos" type={PublicationMainFocus.Video} />
      <FeedLink name="Audio" type={PublicationMainFocus.Audio} />
      <FeedLink name="Images" type={PublicationMainFocus.Image} />
    </div>
  );
};

export default FeedType;
