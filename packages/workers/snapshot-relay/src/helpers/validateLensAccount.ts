type VerifyResponse = {
  data: {
    verify: boolean;
  };
};

const validateLensAccount = async (accessToken: string, isMainnet: boolean) => {
  const response = await fetch(
    isMainnet ? 'https://api.lens.dev' : 'https://api-mumbai.lens.dev',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-agent': 'Lenster-Snapshot-Relay'
      },
      body: JSON.stringify({
        query: `
        query Verify {
          verify(request: { accessToken: "${accessToken}" })
        }
      `
      })
    }
  );

  const json: VerifyResponse = await response.json();

  return json.data.verify;
};

export default validateLensAccount;
