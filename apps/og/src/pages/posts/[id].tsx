import type { GetServerSidePropsContext, NextPage } from 'next';

import SEO from '@components/SEO';

export const config = {
  unstable_runtimeJS: false
};

const Post: NextPage<{ POST_ID: string }> = ({ POST_ID }) => {
  return <SEO image={`/api/post/${POST_ID}`} />;
};

export default Post;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const POST_ID = context.params?.id;
  return {
    props: {
      POST_ID
    }
  };
}
