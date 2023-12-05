import type { GetServerSidePropsContext } from 'next';

import SEO from '@components/SEO';
import { HANDLE_PREFIX } from '@hey/data/constants';
import { ProfileDocument } from '@hey/lens';
import { apolloClient } from '@hey/lens/apollo';

export const config = {
  unstable_runtimeJS: false
};

// @ts-ignore
const C = ({ id }) => {
  return (
    <SEO
      image={`/api/u/${id}?fileType=svg&layoutName=docs&Page=Railway+Documentation&Url=docs.railway.app`}
    />
  );
};

export default C;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params?.user;
  const { data: profileData } = await apolloClient().query({
    query: ProfileDocument,
    variables: { request: { forHandle: HANDLE_PREFIX + id } }
  });
  console.log(id, profileData);
  return {
    props: {
      id
    }
  };
}
