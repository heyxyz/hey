import type { FC } from 'react';

import { APP_NAME, STATIC_IMAGES_URL } from '@hey/data/constants';
import humanize from '@hey/lib/humanize';
import Link from 'next/link';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';

const Score: FC = () => {
  const { score } = useGlobalModalStateStore();

  return (
    <div className="flex flex-col items-center space-y-5 p-5">
      <img
        alt="Score"
        className="size-14"
        src={`${STATIC_IMAGES_URL}/app-icon/2.png`}
      />
      <div className="flex flex-col items-center space-y-2">
        <div className="font-bold">Score</div>
        <div className="w-fit rounded-full bg-gradient-to-r from-green-500 to-cyan-500 px-4 py-0.5 !text-lg font-bold text-white">
          {score ? humanize(score) : '...'}
        </div>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <div className="text-center leading-7">
          <b>{APP_NAME} score</b> is determined by a super-secret algorithm that
          combines the number of crucial interactions you've received, the
          publications you've posted, and lot other factors 🤓
        </div>
        <Link
          className="text-brand-500 underline"
          href="https://yoginth.notion.site/4010193edb6e4bd98cf1e26561859ba1"
          target="_blank"
        >
          Read more about {APP_NAME} score
        </Link>
      </div>
    </div>
  );
};

export default Score;
