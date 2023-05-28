import MetaTags from '@components/Common/MetaTags';
import Sidebar from '@components/Shared/Sidebar';
import { PencilAltIcon, UsersIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/leafwatch';
import { t } from '@lingui/macro';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Custom404 from 'src/pages/404';
import { PAGEVIEW } from 'src/tracking';
import { GridItemEight, GridItemFour, GridLayout } from 'ui';

import Profiles from './Profiles';
import Publications from './Publications';

const Search: NextPage = () => {
  const { query } = useRouter();
  const searchText = Array.isArray(query.q)
    ? encodeURIComponent(query.q.join(' '))
    : encodeURIComponent(query.q || '');

  useEffect(() => {
    Mixpanel.track(PAGEVIEW, { page: 'search' });
  }, []);

  if (!query.q || !['pubs', 'profiles'].includes(query.type as string)) {
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
                title: t`Publications`,
                icon: <PencilAltIcon className="h-4 w-4" />,
                url: `/search?q=${searchText}&type=pubs`,
                active: query.type === 'pubs'
              },
              {
                title: t`Profiles`,
                icon: <UsersIcon className="h-4 w-4" />,
                url: `/search?q=${searchText}&type=profiles`,
                active: query.type === 'profiles'
              }
            ]}
          />
        </GridItemFour>
        <GridItemEight>
          {query.type === 'profiles' && <Profiles query={query.q} />}
          {query.type === 'pubs' && <Publications query={query.q} />}
        </GridItemEight>
      </GridLayout>
    </>
  );
};

export default Search;
