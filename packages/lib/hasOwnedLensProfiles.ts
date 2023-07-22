/**
 * Get is lens profile owned by wallet address
 * @param address Wallet address
 * @param id Lens profile id
 * @param isMainnet Is mainnet
 * @returns is lens profile owned by wallet address or not
 */
const hasOwnedLensProfile = async (
  address: string,
  id: string,
  isMainnet: boolean
) => {
  const response = await fetch(
    isMainnet ? 'https://api.lens.dev' : 'https://api-mumbai.lens.dev',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-agent': 'Lenster'
      },
      body: JSON.stringify({
        query: `
          query Profiles {
            profiles(request: {
              ownedBy: "${address}"
            }) {
              items {
                id
              }
            }
          }
        `
      })
    }
  );

  const json: { data: { profiles: { items: { id: string }[] } } } =
    await response.json();

  const ids = json.data.profiles.items.map((item) => item.id);
  const hasOwned = ids.includes(id);

  return hasOwned;
};

export default hasOwnedLensProfile;
