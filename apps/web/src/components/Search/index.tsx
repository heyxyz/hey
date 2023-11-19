import MetaTags from '@components/Common/MetaTags';
import Sidebar from '@components/Shared/Sidebar';
import { PencilSquareIcon, UsersIcon } from '@heroicons/react/24/outline';
import { PAGEVIEW } from '@hey/data/tracking';
import { GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import type { NextPage } from 'next';
import { useSearchParams } from 'next/navigation';
import Custom404 from 'src/app/not-found';
import { useEffectOnce } from 'usehooks-ts';

import Profiles from './Profiles';
import Publications from './Publications';

const Search: NextPage = () => {
  const query = useSearchParams();
  const searchText = Array.isArray(query.get('q'))
    ? encodeURIComponent((query.get('q') as unknown as string[]).join(' '))
    : encodeURIComponent(query.get('q') || '');

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'search' });
  });

  if (
    !query.get('q') ||
    !['pubs', 'profiles'].includes(query.get('type') ?? '')
  ) {
    return <Custom404 />;
  }

  return (
    <>
      <MetaTags />
      <GridLayout>
        <GridItemFour>
          <Sidebar
            items={[
              {
                title: 'Publications',
                icon: <PencilSquareIcon className="h-4 w-4" />,
                url: `/search?q=${searchText}&type=pubs`,
                active: query.get('type') === 'pubs'
              },
              {
                title: 'Profiles',
                icon: <UsersIcon className="h-4 w-4" />,
                url: `/search?q=${searchText}&type=profiles`,
                active: query.get('type') === 'profiles'
              }
            ]}
          />
        </GridItemFour>
        <GridItemEight>
          {query.get('type') === 'profiles' ? (
            <Profiles query={query.get('q') ?? ''} />
          ) : null}
          {query.get('type') === 'pubs' ? (
            <Publications query={query.get('q') ?? ''} />
          ) : null}
        </GridItemEight>
      </GridLayout>
    </>
  );
};

export default Search;
