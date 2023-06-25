import type { Publication } from '@lenster/lens';
import {
  CustomFiltersTypes,
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreFeedQuery
} from '@lenster/lens';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { Text, View } from 'react-native';
import tailwind from 'twrnc';

const TimelineCell = ({ item }: { item: Publication }) => {
  return (
    <View>
      <View style={tailwind`py-1`}>
        <Text style={tailwind`text-white font-bold`}>
          {item.metadata.content}
        </Text>
      </View>
    </View>
  );
};

const Timeline = () => {
  const request = {
    sortCriteria: PublicationSortCriteria.CuratedProfiles,
    limit: 32,
    noRandomize: false,
    publicationTypes: [PublicationTypes.Post],
    customFilters: [CustomFiltersTypes.Gardeners],
    metadata: {
      mainContentFocus: [PublicationMainFocus.Video]
    }
  };

  const { data } = useExploreFeedQuery({
    variables: { request }
  });

  const videos = data?.explorePublications?.items as Publication[];

  return (
    <View style={tailwind`mt-2 mx-3`}>
      <FlashList
        ItemSeparatorComponent={() => <View />}
        renderItem={({ item }) => {
          return <TimelineCell item={item} />;
        }}
        estimatedItemSize={50}
        data={videos}
      />
    </View>
  );
};

export default Timeline;
