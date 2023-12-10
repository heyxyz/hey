import type { PublicationsRequest } from '@hey/lens';
import type { GetServerSidePropsContext } from 'next';

import Publication from '@components/Publication';
import {
  CommentRankingFilterType,
  CustomFiltersType,
  LimitType,
  PublicationDocument,
  PublicationsDocument
} from '@hey/lens';
import { apolloClient } from '@hey/lens/apollo';

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

  const { data: publicationData } = await apolloClient().query({
    query: PublicationDocument,
    variables: { request: { forId: id } }
  });

  if (publicationData.publication) {
    const { publication } = publicationData;
    const id =
      publication.__typename === 'Mirror'
        ? publication.mirrorOn.id
        : publication.id;

    const request: PublicationsRequest = {
      limit: LimitType.TwentyFive,
      where: {
        commentOn: {
          id,
          ranking: { filter: CommentRankingFilterType.Relevant }
        },
        customFilters: [CustomFiltersType.Gardeners]
      }
    };

    const { data: commentsData } = await apolloClient().query({
      query: PublicationsDocument,
      variables: { request }
    });

    return {
      props: { comments: commentsData.publications?.items, publication }
    };
  }

  return {
    props: { comments: null, publication: null }
  };
}

export default Publication;
