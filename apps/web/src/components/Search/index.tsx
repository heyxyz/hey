import MetaTags from '@components/Common/MetaTags';
import Sidebar from '@components/Shared/Sidebar';
import { PencilSquareIcon, UsersIcon } from '@heroicons/react/24/outline';
import { PAGEVIEW } from '@hey/data/tracking';
import { GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useSearchParams } from 'react-router-dom';
import Custom404 from '@pages/404';
import { useEffectOnce } from 'usehooks-ts';
import Profiles from './Profiles';
import Publications from './Publications';

const Search = () => {
  const [searchParams, _] = useSearchParams();
  const qSearchParam = searchParams.get('q');
  const searchText = Array.isArray(qSearchParam)
    ? encodeURIComponent(qSearchParam.join(' '))
    : encodeURIComponent(qSearchParam || '');

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'search' });
  });

  if (
    !searchParams.get('q') ||
    !['pubs', 'profiles'].includes(searchParams.get('type') as string)
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
                active: searchParams.get('type') === 'pubs'
              },
              {
                title: 'Profiles',
                icon: <UsersIcon className="h-4 w-4" />,
                url: `/search?q=${searchText}&type=profiles`,
                active: searchParams.get('type') === 'profiles'
              }
            ]}
          />
        </GridItemFour>
        <GridItemEight>
          {searchParams.get('type') === 'profiles' ? (
            <Profiles query={searchParams.get('q') as string} />
          ) : null}
          {searchParams.get('type') === 'pubs' ? (
            <Publications query={searchParams.get('q') as string} />
          ) : null}
        </GridItemEight>
      </GridLayout>
    </>
  );
};

export default Search;
