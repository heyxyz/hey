import type { Publication } from '@lenster/lens';
import {
  CustomFiltersTypes,
  PublicationSortCriteria,
  useExploreFeedQuery
} from '@lenster/lens';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { View } from 'react-native';
import tailwind from 'twrnc';

import SinglePublication from '../../publication/SinglePublication';

const Timeline = () => {
  const request = {
    sortCriteria: PublicationSortCriteria.CuratedProfiles,
    limit: 50,
    noRandomize: false,
    customFilters: [CustomFiltersTypes.Gardeners]
  };

  const { data } = useExploreFeedQuery({
    variables: { request }
  });

  const publications = data?.explorePublications?.items as Publication[];

  return (
    <View style={tailwind`mt-2 mx-3`}>
      <FlashList
        ItemSeparatorComponent={() => <View />}
        renderItem={({ item }) => {
          return <SinglePublication publication={item} />;
        }}
        estimatedItemSize={50}
        data={publications}
      />
    </View>
  );
};

export default Timeline;
