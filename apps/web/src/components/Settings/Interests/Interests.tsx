import type { ProfileInterestsRequest, ProfileInterestTypes } from '@hey/lens';
import type { FC } from 'react';

import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { SETTINGS } from '@hey/data/tracking';
import {
  useAddProfileInterestsMutation,
  useProfileInterestsOptionsQuery,
  useRemoveProfileInterestsMutation
} from '@hey/lens';
import { useApolloClient } from '@hey/lens/apollo';
import { Button } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import sanitizeProfileInterests from '@lib/sanitizeProfileInterests';
import useProfileStore from 'src/store/persisted/useProfileStore';

import Loader from '../../Shared/Loader';

const MAX_TOPICS_ALLOWED = 12;

const Interests: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const { cache } = useApolloClient();

  const updateCache = (interests: string[]) => {
    cache.modify({
      fields: { interests: () => interests },
      id: `Profile:${currentProfile?.id}`
    });
  };

  const onError = (error: any) => {
    errorToast(error);
  };

  const { data, loading } = useProfileInterestsOptionsQuery({
    variables: { request: { forProfileId: currentProfile?.id } }
  });
  const [addProfileInterests] = useAddProfileInterestsMutation({
    onCompleted: () => Leafwatch.track(SETTINGS.INTERESTS.ADD),
    onError
  });
  const [removeProfileInterests] = useRemoveProfileInterestsMutation({
    onCompleted: () => Leafwatch.track(SETTINGS.INTERESTS.REMOVE),
    onError
  });

  const interestsData = data?.profileInterestsOptions as ProfileInterestTypes[];
  const selectedTopics = data?.profile?.interests || [];

  const onSelectTopic = (topic: ProfileInterestTypes) => {
    const request: ProfileInterestsRequest = {
      interests: [topic]
    };
    if (!selectedTopics.includes(topic)) {
      const interests = [...selectedTopics, topic];
      updateCache(interests);
      return addProfileInterests({ variables: { request } });
    }
    const topics = [...selectedTopics];
    topics.splice(topics.indexOf(topic), 1);
    updateCache(topics);
    return removeProfileInterests({ variables: { request } });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-4">
      {sanitizeProfileInterests(interestsData)?.map(
        ({ category, subCategories }) => (
          <div className="space-y-2" key={category.id}>
            <h2 className="text-sm font-medium capitalize">{category.label}</h2>
            <div className="flex flex-wrap items-center gap-3">
              {subCategories?.map((subCategory) => (
                <Button
                  className="font-medium capitalize"
                  disabled={
                    !selectedTopics.includes(subCategory.id) &&
                    selectedTopics.length === MAX_TOPICS_ALLOWED
                  }
                  icon={
                    selectedTopics.includes(subCategory.id) ? (
                      <CheckCircleIcon className="text-brand-500 size-4" />
                    ) : (
                      <PlusCircleIcon className="size-4" />
                    )
                  }
                  key={subCategory.id}
                  onClick={() =>
                    onSelectTopic(subCategory.id as ProfileInterestTypes)
                  }
                  outline
                  size="sm"
                  variant={
                    selectedTopics.includes(subCategory.id)
                      ? 'primary'
                      : 'secondary'
                  }
                >
                  <div>{subCategory.label}</div>
                </Button>
              ))}
              {!subCategories.length ? (
                <Button
                  className="font-medium capitalize"
                  disabled={
                    !selectedTopics.includes(category.id) &&
                    selectedTopics.length === MAX_TOPICS_ALLOWED
                  }
                  icon={
                    selectedTopics.includes(category.id) ? (
                      <CheckCircleIcon className="text-brand-500 size-4" />
                    ) : (
                      <PlusCircleIcon className="size-4" />
                    )
                  }
                  key={category.id}
                  onClick={() =>
                    onSelectTopic(category.id as ProfileInterestTypes)
                  }
                  outline
                  size="sm"
                  variant={
                    selectedTopics.includes(category.id)
                      ? 'primary'
                      : 'secondary'
                  }
                >
                  <div>{category.label}</div>
                </Button>
              ) : null}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Interests;
