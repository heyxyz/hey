import Profile from '@components/Profile';
import { HANDLE_SUFFIX, LENSPROTOCOL_HANDLE } from 'data/constants';
import { PrerenderProfileDocument } from 'lens';
import type { GetServerSidePropsContext } from 'next';
import client from 'src/apollo';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const handle = context.params?.handle;

  // Cache the response for 60 days
  context.res.setHeader('Cache-Control', 'public, max-age=5184000');

  if (!handle) {
    return {
      props: { data: null }
    };
  }

  let processedHandle;
  if (handle.includes(HANDLE_SUFFIX)) {
    processedHandle = handle;
  } else {
    processedHandle = handle === LENSPROTOCOL_HANDLE ? handle : handle.concat(HANDLE_SUFFIX);
  }
  const { data } = await client.query({
    query: PrerenderProfileDocument,
    variables: { request: { handle: processedHandle } }
  });

  return {
    props: { profile: data?.profile }
  };
}

export default Profile;
