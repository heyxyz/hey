import type { Profile } from 'lens';

/**
 *
 * @param profile - Profile id
 * @returns `true` if handle is same as ENS name
 *
 * Examples for handle "vitalik.lens":
 *  - ENS: "vitalik.eth" returns `true`
 *  - ENS: "lens.vitalik.eth" returns `true`
 *  - ENS "vitalik.eth.somebodyelse.eth" returns `false` (trying to impersonate)
 */
function isEnsVerified(profile: Profile): boolean {
  const ensName = (profile?.onChainIdentity?.ens?.name || '') as string;
  const handleWithEnsSuffix = profile?.handle.replace(/\.lens$/, '.eth');

  return ensName.endsWith(handleWithEnsSuffix);
}

export default isEnsVerified;
