import type { MediaSet, NftImage, Profile } from '@generated/types';
import getIPFSLink from '@lib/getIPFSLink';

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
    <div
      style={{
        height: '600px',
        width: '1200px',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ height: '579px', width: '1200px', display: 'flex' }}>
        <div
          style={{
            display: 'flex',
            width: '925px',
            paddingLeft: '84px',
            flexDirection: 'column'
          }}
        >
          <div
            style={{
              paddingTop: '85px',
              display: 'flex',
              fontSize: '72px',
              fontWeight: 'bold',
              fontFamily: 'CircularXX Bold'
            }}
          >
            {name}
          </div>
          <div
            style={{
              color: '#8B5CF6',
              fontWeight: 'bold',
              display: 'flex',
              fontSize: '28px',
              marginTop: '11px',
              fontFamily: 'CircularXX Medium'
            }}
          >
            {handle}
          </div>

          <div
            style={{
              marginTop: '37px',
              fontSize: '24px',
              display: 'flex',
              fontWeight: '500',
              height: '150px'
            }}
          >
            {description}
          </div>
          <div style={{ display: 'flex' }}>
            <div
              style={{
                width: '130px',
                height: '60px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div
                style={{
                  fontWeight: 'bold',
                  fontSize: '22px',
                  display: 'flex',
                  fontFamily: 'CircularXX Medium'
                }}
              >
                Following
              </div>
              <div style={{ fontSize: '22px', display: 'flex' }}>{totalFollowing}</div>
            </div>
            <div
              style={{
                width: '130px',
                height: '60px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div
                style={{
                  fontWeight: 'bold',
                  fontSize: '22px',
                  display: 'flex',
                  fontFamily: 'CircularXX Medium'
                }}
              >
                Followers
              </div>
              <div style={{ fontSize: '22px', display: 'flex' }}>{totalFollowers}</div>
            </div>
            <div
              style={{
                width: '130px',
                height: '60px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* <div
              style={{
                fontWeight: 'bold',
                fontSize: '22px',
                display: 'flex',
                fontFamily: 'CircularXX Medium'
              }}
            >
              Posts
            </div>
            <div style={{ fontSize: '22px', display: 'flex' }}>{1}</div> */}
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            width: '275px',
            height: '579px',
            flexDirection: 'column'
          }}
        >
          <div
            style={{
              height: '225px',
              width: '225px',
              display: 'flex',
              marginTop: '71px',
              backgroundColor: '#C3B0EE',
              borderRadius: '10px',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <img src={image} style={{ height: '200px', width: '200px', borderRadius: '10px' }} />
          </div>
          <img
            src="https://lenster.xyz/logo.svg"
            style={{
              height: '100px',
              width: '100px',
              marginTop: '120px',
              marginLeft: '130px'
            }}
          />
        </div>
      </div>
      <div style={{ height: '21px', backgroundColor: '#8B5CF6', width: '1200px', display: 'flex' }} />
    </div>
  );
};
