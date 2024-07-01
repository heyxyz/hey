import lensPg from '../db/lensPg';
import createClickhouseClient from '../helpers/createClickhouseClient';

const startDate = '2024-06-01 00:07:17';
const endDate = '2024-06-30 23:58:57';

const getProfiles = async () => {
  const profiles = await lensPg.query(
    `
      SELECT profile_id, block_timestamp FROM app.onboarding_profile
      WHERE onboarded_by_address = $1
      AND block_timestamp BETWEEN $2 AND $3;
    `,
    ['0x4b8845ACb8148dE64D1D99Cf27A3890a91F55E53', startDate, endDate]
  );

  return profiles;
};

const getInvoiceCountries = async () => {
  const clickhouse = createClickhouseClient();
  const profiles = await getProfiles();
  const ids = profiles.map((profile) => profile.profile_id);

  if (ids.length === 0) {
    console.log('No profiles found for the given criteria.');
    return;
  }

  const query = `
    SELECT country, COUNT(DISTINCT actor) as invoices
    FROM (
      SELECT actor, any(country) as country
      FROM events
      WHERE actor IN (${ids.map((id) => `'${id}'`).join(', ')})
      GROUP BY actor
    ) AS subquery
    GROUP BY country
    ORDER BY invoices DESC
  `;
  const rows = await clickhouse.query({ format: 'JSONEachRow', query });
  const result = await rows.json<{ country: string; invoices: string }>();

  const sumOfInvoices = result.reduce(
    (acc, row) => acc + parseInt(row.invoices),
    0
  );
  console.log(`Total invoices: ${sumOfInvoices}`);

  const formattedResult = result.map(
    (row: { country: string; invoices: string }) => ({
      country: row.country,
      invoices: parseInt(row.invoices)
    })
  );

  console.table(formattedResult);

  return true;
};

getInvoiceCountries();
