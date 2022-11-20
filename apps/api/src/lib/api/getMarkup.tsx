// @ts-nocheck
// too much noise for tw so no check
import type { MediaSet, NftImage, Profile } from '@generated/types';
import getIPFSLink from '@lib/getIPFSLink';
import { nFormatter } from 'utils';

export const markUp = (profile: Profile & { picture: MediaSet & NftImage }) => {
  const name = profile?.name;
  const handle = `@${profile?.handle}`;
  const description = profile?.bio ?? '';
  const image = profile
    ? `https://ik.imagekit.io/lensterimg/tr:n-avatar/${getIPFSLink(
        profile?.picture?.original?.url ??
          profile?.picture?.uri ??
          `https://avatar.tobi.sh/${profile?.ownedBy}_${profile?.handle}.png`
      )}`
    : 'https://assets.lenster.xyz/images/og/logo.jpeg';

  const { totalFollowing, totalFollowers } = profile.stats;
  return (
    <div tw="flex h-[600px] w-[1200px] bg-white flex-col">
      <div tw="h-[579px] w-[1200px] flex">
        <div tw="flex w-[925px] pl-[84px] flex-col">
          <div tw="pt-[85px] flex text-[102px] font-bold font-[CircularXX Bold]">{name}</div>
          <div tw="text-[#8B5CF6] font-bold flex mt-[11px] text-[51px] font-[CircularXX Medium]">
            {handle}
          </div>

          <div tw="mt-[37px] text-[30px] flex h-[150px]">{description}</div>
          <div tw="flex" style={{ display: 'flex' }}>
            <div tw="flex flex-col w-[170px] h-[60px]">
              <div tw="font-bold text-[30px] flex font-[CircularXX Medium]">Following</div>
              <div tw="text-[28px] flex">{nFormatter(totalFollowing)}</div>
            </div>
            <div tw="flex flex-col w-[170px] h-[60px]">
              <div tw="font-bold text-[30px] flex font-[CircularXX Medium]">Followers</div>
              <div tw="text-[28px] flex">{nFormatter(totalFollowers)}</div>
            </div>
          </div>
        </div>

        <div tw="flex flex-col w-[275px] h-[579px]">
          <div tw="flex items-center justify-center rounded-[10px] bg-[#C3B0EE] mt-[71px] h-[225px] w-[225px]">
            <img tw="h-[200px] w-[200px] rounded-[10px]" src={image} />
          </div>
          <img tw="h-[100px] w-[100px] mt-[120px] ml-[130px]" src="https://lenster.xyz/logo.svg" />
        </div>
      </div>
      <div tw="h-[21px] bg-[#8B5CF6] w-[1200px] flex" />
    </div>
  );
};
