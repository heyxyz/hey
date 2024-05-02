import type { NextPage } from 'next';

import Sidebar from '@components/Shared/Sidebar';
import { Leafwatch } from '@helpers/leafwatch';
import { PencilSquareIcon, UsersIcon } from '@heroicons/react/24/outline';
import { PAGEVIEW } from '@hey/data/tracking';
import { GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Custom404 from 'src/pages/404';

import Profiles from './Profiles';
import Publications from './Publications';

const Search: NextPage = () => {
  const { query } = useRouter();
  const searchText = Array.isArray(query.q)
    ? encodeURIComponent(query.q.join(' '))
    : encodeURIComponent(query.q || '');

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: 'search' });
  }, []);

  if (!query.q || !['profiles', 'pubs'].includes(query.type as string)) {
    return <Custom404 />;
  }

  const settingsSidebarItems = [
    {
      active: query.type === 'pubs',
      icon: <PencilSquareIcon className="size-4" />,
      title: 'Publications',
      url: `/search?q=${searchText}&type=pubs`
    },
    {
      active: query.type === 'profiles',
      icon: <UsersIcon className="size-4" />,
      title: 'Profiles',
      url: `/search?q=${searchText}&type=profiles`
    }
  ];

  return (
    <GridLayout>
      <GridItemFour>
        <Sidebar items={settingsSidebarItems} />
      </GridItemFour>
      <GridItemEight>
        {query.type === 'profiles' ? (
          <Profiles query={query.q as string} />
        ) : null}
        {query.type === 'pubs' ? (
          <Publications query={query.q as string} />
        ) : null}
      </GridItemEight>
    </GridLayout>
  );
};

export default Search;
