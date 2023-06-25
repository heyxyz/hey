import type { ExplorePublicationRequest, Publication } from '@lenster/lens';
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
  const request: ExplorePublicationRequest = {
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
    <View style={tailwind`mt-2`}>
      <FlashList
        ItemSeparatorComponent={() => (
          <View style={tailwind`border-b border-gray-500`} />
        )}
        renderItem={({ item }) => {
          return <SinglePublication publication={item} style="m-5" />;
        }}
        estimatedItemSize={50}
        data={publications}
      />
    </View>
  );
};

export default Timeline;
