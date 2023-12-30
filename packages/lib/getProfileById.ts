import { lensClient } from './../../apps/web/src/utils/createLensClient';
const profileById = async (id: string) => {
  if (!id) {
    console.log('Invalid param');
    return;
  }
  return await lensClient.profile
    .fetch({
      forProfileId: id
    })
    .then((profile) => {
      console.log({ profile });
      return profile;
    })
    .catch((error) => {
      console.log({ error });
      return error;
    });
};

export default profileById;
