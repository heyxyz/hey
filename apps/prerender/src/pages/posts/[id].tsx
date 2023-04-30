import Publication from '@components/Publication';
import {
  CommentFeedDocument,
  CommentOrderingTypes,
  CommentRankingFilter,
  CustomFiltersTypes,
  PublicationDocument
} from 'lens';
import { nodeClient } from 'lens/apollo';
import type { GetServerSidePropsContext } from 'next';

export const config = {
  unstable_runtimeJS: false
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params?.id;

  // Cache the response for 60 days
  context.res.setHeader('Cache-Control', 'public, max-age=5184000');

  if (!id) {
    return {
      props: { data: null }
    };
  }

  const { data: publicationData } = await nodeClient.query({
    query: PublicationDocument,
    variables: { request: { publicationId: id } }
  });

  if (publicationData.publication) {
    const profileId = null;
    const reactionRequest = { profileId };
    const { publication } = publicationData;
    const id =
      publication.__typename === 'Mirror'
        ? publication.mirrorOf.id
        : publication.id;

    const { data: commentsData } = await nodeClient.query({
      query: CommentFeedDocument,
      variables: {
        request: {
          commentsOf: id,
          customFilters: [CustomFiltersTypes.Gardeners],
          commentsOfOrdering: CommentOrderingTypes.Ranking,
          commentsRankingFilter: CommentRankingFilter.Relevant,
          limit: 30
        },
        reactionRequest,
        profileId
      }
    });

    return {
      props: { publication, comments: commentsData.publications?.items }
    };
  }

  return {
    props: { publication: null, comments: null }
  };
}

export default Publication;
