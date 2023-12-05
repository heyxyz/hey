import type { GetServerSidePropsContext, NextPage } from 'next';

import SEO from '@components/SEO';

export const config = {
  unstable_runtimeJS: false
};

const C: NextPage = ({ HANDLE }) => {
  return (
    <SEO
      image={`/api/u/${HANDLE}?fileType=svg&layoutName=docs&Page=Railway+Documentation&Url=docs.railway.app`}
    />
  );
};

export default C;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const HANDLE = context.params?.handle;
  return {
    props: {
      HANDLE
    }
  };
}
