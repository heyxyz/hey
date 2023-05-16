export const resolveEns = async (addresses: string[]) => {
  const response = await fetch('https://ens-resolver.lenster.xyz', {
    method: 'POST',
    body: JSON.stringify({
      addresses: addresses.map((address) => {
        return address.split('/')[0];
      })
    })
  });
  return await response.json();
};
