import type { Profile } from 'lens';
import { ProfilesDocument } from 'lens';
import { nodeClient } from 'lens/apollo';

const isProfileOwnByAddress = async (id: string, address: string) => {
  const { data } = await nodeClient.query({
    query: ProfilesDocument,
    variables: { request: { ownedBy: address } }
  });
  const ids = data.profiles.items.map((item: Profile) => item.id);

  if (!ids.includes(id)) {
    throw new Error('Profile is not owned by address');
  }
};

export default isProfileOwnByAddress;
