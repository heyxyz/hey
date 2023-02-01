import { Analytics } from '@lib/analytics';
import { t } from '@lingui/macro';
import clsx from 'clsx';
import { PublicationMainFocus } from 'lens';
import type { Dispatch, FC } from 'react';

interface Props {
  setFocus: Dispatch<PublicationMainFocus>;
  focus?: PublicationMainFocus;
}

const FeedType: FC<Props> = ({ setFocus, focus }) => {
  interface FeedLinkProps {
    name: string;
    type?: PublicationMainFocus;
  }

  const FeedLink: FC<FeedLinkProps> = ({ name, type }) => (
    <button
      type="button"
      onClick={() => {
        setFocus(type as PublicationMainFocus);
        Analytics.track(`select_${(type ?? 'all_posts')?.toLowerCase()}_filter_in_explore`);
      }}
      className={clsx(
        { '!bg-brand-500 !text-white': focus === type },
        'bg-brand-100 text-brand border-brand-300 dark:border-brand-500 rounded-full border px-3 py-1.5 text-xs dark:bg-opacity-10 sm:px-4'
      )}
      aria-label={name}
    >
      {name}
    </button>
  );

  return (
    <div className="mt-3 flex flex-wrap gap-3 px-5 sm:mt-0 sm:px-0">
      <FeedLink name={t`All posts`} />
      <FeedLink name={t`Text`} type={PublicationMainFocus.TextOnly} />
      <FeedLink name={t`Video`} type={PublicationMainFocus.Video} />
      <FeedLink name={t`Audio`} type={PublicationMainFocus.Audio} />
      <FeedLink name={t`Images`} type={PublicationMainFocus.Image} />
    </div>
  );
};

export default FeedType;
