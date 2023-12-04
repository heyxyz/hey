import SEO from '@components/SEO';
// import { useProfileQuery } from '@hey/lens';

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

// @ts-ignore
export async function getServerSideProps({ params }) {
  const id = params.user;
  // const { data, loading } = useProfileQuery({
  //   skip: !Boolean(id),
  //   variables: { request: { forProfileId: id } }
  // });
  return {
    props: {
      id
    }
  };
}
