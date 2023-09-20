import { AVATAR, ZERO_ADDRESS } from '@lenster/data/constants';
import type { PublicClient } from 'viem';
import { decodeAbiParameters, parseAbiParameters } from 'viem';

import getStampFyiURL from './getStampFyiURL';
import imageKit from './imageKit';
import sanitizeDStorageUrl from './sanitizeDStorageUrl';

/**
 * Returns the avatar image URL for a given profile.
 *
 * @param profile The profile object.
 * @param namedTransform The named transform to use.
 * @returns The avatar image URL.
 */
const getAvatar = (profile: any, namedTransform = AVATAR): string => {
  const avatarUrl =
    profile?.avatar ??
    profile?.picture?.original?.url ??
    profile?.picture?.uri ??
    getStampFyiURL(profile?.ownedBy ?? ZERO_ADDRESS);

  return imageKit(sanitizeDStorageUrl(avatarUrl), namedTransform);
};

export const getAvatarAsync = async (
  profile: any,
  namedTransform = AVATAR,
  publicClient: PublicClient
): Promise<string> => {
  const bytecode = await publicClient.getBytecode({ address: profile.ownedBy });
  if (bytecode && bytecode.length / 2 - 1 == 173) {
    const accountFooter = `0x${bytecode.substring(
      bytecode.length - 192
    )}` as `0x${string}`;
    const [chainId, tokenContract, tokenId] = decodeAbiParameters(
      parseAbiParameters('uint256,address,uint256'),
      accountFooter
    );

    if (chainId == 1n) {
      const metadata = await fetch(
        `https://ether.actor/nft/${tokenContract}/${tokenId}.json`
      ).then((res) => res.json());
      return imageKit(
        sanitizeDStorageUrl(metadata.metadata.image),
        namedTransform
      );
    }
  }
  return getAvatar(profile, namedTransform);
};

export default getAvatar;
