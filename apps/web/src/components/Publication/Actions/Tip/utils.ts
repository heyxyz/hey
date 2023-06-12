const ethers = require('ethers');

export const encodePublicationId = (publicationId: string) => {
  const ids = publicationId.split('-');
  let profileId = ids[0].slice(2);
  let postId = ids[1].slice(2);

  profileId = profileId + '1' + '0'.repeat(31 - profileId.length);
  postId = postId + '1' + '0'.repeat(31 - postId.length);

  return ethers.utils.hexZeroPad('0x' + profileId + postId, 32);
};

export const decodePublicationId = (encodedId: string) => {
  let profileId = encodedId.slice(2, 34);
  let postId = encodedId.slice(34, 66);

  profileId = '0x' + profileId.slice(0, profileId.lastIndexOf('1'));
  postId = '0x' + postId.slice(0, postId.lastIndexOf('1'));

  return profileId + '-' + postId;
};
