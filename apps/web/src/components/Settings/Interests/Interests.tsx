import { useApolloClient } from "@apollo/client";
import Loader from "@components/Shared/Loader";
import errorToast from "@helpers/errorToast";
import { Leafwatch } from "@helpers/leafwatch";
import sanitizeAccountInterests from "@helpers/sanitizeAccountInterests";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Errors } from "@hey/data/errors";
import { SETTINGS } from "@hey/data/tracking";
import type { ProfileInterestTypes, ProfileInterestsRequest } from "@hey/lens";
import {
  useAddProfileInterestsMutation,
  useProfileInterestsOptionsQuery,
  useRemoveProfileInterestsMutation
} from "@hey/lens";
import { Button } from "@hey/ui";
import type { FC } from "react";
import toast from "react-hot-toast";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";

const MAX_TOPICS_ALLOWED = 12;

const Interests: FC = () => {
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const { cache } = useApolloClient();

  const updateCache = (interests: string[]) => {
    cache.modify({
      fields: { interests: () => interests },
      id: `Profile:${currentAccount?.id}`
    });
  };

  const onError = (error: any) => {
    errorToast(error);
  };

  const { data, loading } = useProfileInterestsOptionsQuery({
    variables: { request: { forProfileId: currentAccount?.id } }
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

  const handleSelectTopic = (topic: ProfileInterestTypes) => {
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      const request: ProfileInterestsRequest = { interests: [topic] };
      if (!selectedTopics.includes(topic)) {
        const interests = [...selectedTopics, topic];
        updateCache(interests);

        return addProfileInterests({ variables: { request } });
      }

      const topics = [...selectedTopics];
      topics.splice(topics.indexOf(topic), 1);
      updateCache(topics);

      return removeProfileInterests({ variables: { request } });
    } catch (error) {
      onError(error);
    }
  };

  if (loading) {
    return <Loader className="py-10" />;
  }

  return (
    <div className="m-5 space-y-4">
      {sanitizeAccountInterests(interestsData)?.map(
        ({ category, subCategories }) => (
          <div className="space-y-2" key={category.id}>
            <h2 className="font-medium text-sm capitalize">{category.label}</h2>
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
                      <CheckCircleIcon className="size-4" />
                    ) : (
                      <PlusCircleIcon className="size-4" />
                    )
                  }
                  key={subCategory.id}
                  onClick={() =>
                    handleSelectTopic(subCategory.id as ProfileInterestTypes)
                  }
                  outline
                  size="sm"
                >
                  <div>{subCategory.label}</div>
                </Button>
              ))}
              {subCategories.length ? null : (
                <Button
                  className="font-medium capitalize"
                  disabled={
                    !selectedTopics.includes(category.id) &&
                    selectedTopics.length === MAX_TOPICS_ALLOWED
                  }
                  icon={
                    selectedTopics.includes(category.id) ? (
                      <CheckCircleIcon className="size-4" />
                    ) : (
                      <PlusCircleIcon className="size-4" />
                    )
                  }
                  key={category.id}
                  onClick={() =>
                    handleSelectTopic(category.id as ProfileInterestTypes)
                  }
                  outline
                  size="sm"
                >
                  <div>{category.label}</div>
                </Button>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Interests;
