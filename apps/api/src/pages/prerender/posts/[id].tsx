import Publication from '@components/Publication';
import { PrerenderPublicationDocument } from 'lens';
import type { GetServerSidePropsContext } from 'next';
import client from 'src/apollo';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params?.id;

  if (!id) {
    return {
      props: { data: null }
    };
  }

  const { data } = await client.query({
    query: PrerenderPublicationDocument,
    variables: { request: { publicationId: id } }
  });

  return {
    props: { publication: data?.publication }
  };
}

export default Publication;
