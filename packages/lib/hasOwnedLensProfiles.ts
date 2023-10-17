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
    isMainnet ? 'https://api.lens.dev' : 'https://api-v2-mumbai.lens.dev',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-agent': 'Hey.xyz'
      },
      body: JSON.stringify({
        query: `
          query ProfilesManaged {
            profilesManaged(request: {
              for: "${address}"
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

  const json: { data: { profilesManaged: { items: { id: string }[] } } } =
    await response.json();

  console.log(`
  query ProfilesManaged {
    profilesManaged(request: {
      for: "${address}"
    }) {
      items {
        id
      }
    }
  }
`);

  const ids = json.data.profilesManaged.items.map((item) => item.id);
  const hasOwned = ids.includes(id);

  return hasOwned;
};

export default hasOwnedLensProfile;
