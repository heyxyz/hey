import Publication from '@components/Publication';
import { PrerenderPublicationDocument } from 'lens';
import { nodeClient } from 'lens/apollo';
import type { GetServerSidePropsContext } from 'next';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params?.id;

  // Cache the response for 60 days
  context.res.setHeader('Cache-Control', 'public, max-age=5184000');

  if (!id) {
    return {
      props: { data: null }
    };
  }

  const { data } = await nodeClient.query({
    query: PrerenderPublicationDocument,
    variables: { request: { publicationId: id } }
  });

  return {
    props: { publication: data?.publication }
  };
}

export default Publication;
