import lensPg from "@hey/db/lensPg";
import type { FiatRate } from "@hey/types/lens";

const getRates = async (): Promise<FiatRate[]> => {
  try {
    const response = await lensPg.query(`
      SELECT ec.name AS name,
        ec.symbol AS symbol,
        ec.decimals AS decimals,
        ec.currency AS address,
        fc.price AS fiat
      FROM fiat.conversion AS fc
      JOIN enabled.currency AS ec ON fc.currency = ec.currency
      WHERE fc.fiatsymbol = 'usd';
    `);

    const result = response.map((row: any) => ({
      address: row.address.toLowerCase(),
      decimals: row.decimals,
      fiat: Number(row.fiat),
      name: row.name,
      symbol: row.symbol
    }));

    return result;
  } catch {
    return [];
  }
};

export default getRates;
