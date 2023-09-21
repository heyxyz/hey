import Publication from '@components/Publication';
import type { PublicationsRequest } from '@lenster/lens';
import {
  CommentRankingFilterType,
  CustomFiltersType,
  LimitType,
  PublicationDocument,
  PublicationsDocument,
  PublicationType
} from '@lenster/lens';
import { lensApolloNodeClient } from '@lenster/lens/apollo';
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

  const { data: publicationData } = await lensApolloNodeClient.query({
    query: PublicationDocument,
    variables: { request: { publicationId: id } }
  });

  if (publicationData.publication) {
    const { publication } = publicationData;
    const id =
      publication.__typename === 'Mirror'
        ? publication.mirrorOn.id
        : publication.id;

    const request: PublicationsRequest = {
      where: {
        commentOn: {
          id,
          commentsRankingFilter: CommentRankingFilterType.Relevant
        },
        publicationTypes: [PublicationType.Comment],
        customFilters: [CustomFiltersType.Gardeners]
      },
      limit: LimitType.Fifty
    };

    const { data: commentsData } = await lensApolloNodeClient.query({
      query: PublicationsDocument,
      variables: { request }
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
