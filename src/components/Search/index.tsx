import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout';
import Seo from '@components/utils/Seo';
import { Hog } from '@lib/hog';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Custom404 from 'src/pages/404';
import { PAGEVIEW } from 'src/tracking';

import Profiles from './Profiles';
import Publications from './Publications';
import Sidebar from './Sidebar';

const Search: NextPage = () => {
  useEffect(() => {
    Hog.track('Pageview', { page: PAGEVIEW.SEARCH });
  }, []);

  const { query } = useRouter();

  if (!query.q || !['pubs', 'profiles'].includes(query.type as any)) {
    return <Custom404 />;
  }

  return (
    <>
      <Seo />
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
