import Profile from '@components/Profile';
import type { PublicationsRequest } from '@lenster/lens';
import {
  CustomFiltersType,
  LimitType,
  ProfileDocument,
  PublicationsDocument
} from '@lenster/lens';
import { lensApolloNodeClient } from '@lenster/lens/apollo';
import type { GetServerSidePropsContext } from 'next';

export const config = {
  unstable_runtimeJS: false
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const handle = context.params?.handle;

  // Cache the response for 60 days
  context.res.setHeader('Cache-Control', 'public, max-age=5184000');

  if (!handle) {
    return {
      props: { data: null }
    };
  }

  const { data: profileData } = await lensApolloNodeClient.query({
    query: ProfileDocument,
    variables: { request: { handle } }
  });

  if (profileData.profile) {
    const profileId = profileData.profile.id;

    const request: PublicationsRequest = {
      where: {
        from: profileId,
        customFilters: [CustomFiltersType.Gardeners]
      },
      limit: LimitType.Fifty
    };

    const { data: profilePublicationsData } = await lensApolloNodeClient.query({
      query: PublicationsDocument,
      variables: { request }
    });

    return {
      props: {
        profile: profileData.profile,
        publications: profilePublicationsData.publications?.items
      }
    };
  }

  return {
    props: { profile: null, publications: null }
  };
}

export default Profile;
