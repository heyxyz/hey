import { usePublicationQuery } from 'lens';
import { useRouter } from 'next/router';
import { useAppStore } from 'src/store/app';
export const PublicationRow = ({
  publicationId,
  uniqueContributors,
  totalTipped
}: {
  publicationId: string;
  uniqueContributors: number;
  totalTipped: string;
}) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { push } = useRouter();

  const { data, loading, error } = usePublicationQuery({
    variables: {
      request: { publicationId },
      profileId: currentProfile?.id ?? null
    },
    skip: !publicationId
  });

  if (error) {
    return null;
  }

  if (loading || !data?.publication) {
    return null;
  }

  return (
    <div
      className="cursor-pointer p-4  hover:bg-gray-100"
      onClick={() => {
        push(`/posts/${publicationId}`);
      }}
    >
      <div className="font-bold">{data.publication.metadata.content || data.publication.metadata.name}</div>
      <div className="font-grey-700 text-brand-600">
        {totalTipped} DAI by {uniqueContributors} tippers
      </div>
    </div>
  );
};

export default PublicationRow;
