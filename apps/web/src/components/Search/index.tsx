import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import MetaTags from '@components/utils/MetaTags';
import { Leafwatch } from '@lib/leafwatch';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Custom404 from 'src/pages/404';
import { PAGEVIEW } from 'src/tracking';

import Profiles from './Profiles';
import Publications from './Publications';
import Sidebar from './Sidebar';

const Search: NextPage = () => {
  const { query } = useRouter();

  useEffect(() => {
    Leafwatch.track('Pageview', { path: PAGEVIEW.SEARCH });
  }, []);

  if (!query.q || !['pubs', 'profiles'].includes(query.type as any)) {
    return <Custom404 />;
  }

  return (
    <>
      <MetaTags />
      <GridLayout>
        <GridItemFour>
          <Sidebar />
        </GridItemFour>
        <GridItemEight className="space-y-5">
          {query.type === 'profiles' && <Profiles query={query.q} />}
          {query.type === 'pubs' && <Publications query={query.q} />}
        </GridItemEight>
      </GridLayout>
    </>
  );
};

export default Search;
