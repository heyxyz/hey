import Profile from '@components/Profile';
import { HANDLE_PREFIX } from '@hey/data/constants';
import type { PublicationsRequest } from '@hey/lens';
import {
  CustomFiltersType,
  LimitType,
  ProfileDocument,
  PublicationsDocument
} from '@hey/lens';
import { lensApolloNodeClient } from '@hey/lens/apollo';
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
    variables: { request: { forHandle: `${HANDLE_PREFIX}${handle}` } }
  });

  console.log('profileData', profileData);

  if (profileData.profile) {
    const profileId = profileData.profile.id;

    const request: PublicationsRequest = {
      where: {
        from: profileId,
        customFilters: [CustomFiltersType.Gardeners]
      },
      limit: LimitType.TwentyFive
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
