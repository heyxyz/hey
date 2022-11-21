import type { Profile } from 'lens';

/**
 *
 * @param profile - Profile id
 * @returns `true` if handle is same as ENS name
 *
 * Examples for handle "vitalik.lens":
 *  - ENS: "vitalik.eth" returns `true`
 *  - ENS: "lens.vitalik.eth" returns `true`
 *  - ENS "anothervitalik.eth" returns `false` (trying to impersonate)
 *  - ENS "vitalik.eth.somebodyelse.eth" returns `false` (trying to impersonate)
 */
function isEnsVerified(profile: Profile): boolean {
  const ensName = (profile?.onChainIdentity?.ens?.name || '') as string;

  const ensPrimaryDomain = ensName.split('.').slice(-2)[0];
  const lensHandle = profile.handle.replace(/\.lens$/, '');

  return ensPrimaryDomain === lensHandle;
}

export default isEnsVerified;
