import Publication from '@components/Publication';
import type { PublicationsRequest } from '@hey/lens';
import {
  CustomFiltersType,
  LimitType,
  PublicationDocument,
  PublicationsDocument
} from '@hey/lens';
import { apolloClient } from '@hey/lens/apollo';
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
      where: {
        commentOn: { id },
        customFilters: [CustomFiltersType.Gardeners]
      },
      limit: LimitType.TwentyFive
    };

    const { data: commentsData } = await apolloClient().query({
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
