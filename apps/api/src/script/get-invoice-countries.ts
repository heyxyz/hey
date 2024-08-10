import lensPg from '@hey/db/lensPg';
import leafwatch from '@hey/db/prisma/leafwatch/client';

const startDate = '2024-07-01 00:00:00';
const endDate = '2024-07-31 23:59:59';

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
  const profiles = await getProfiles();
  const ids = profiles.map((profile) => profile.profile_id);

  if (ids.length === 0) {
    console.log('No profiles found for the given criteria.');
    return;
  }

  const data = await leafwatch.event.groupBy({
    _count: { actor: true },
    by: ['country'],
    orderBy: { _count: { actor: 'desc' } },
    where: { actor: { in: ids } }
  });

  const sumOfInvoices = data.reduce((acc, row) => acc + row._count.actor, 0);
  console.log(`Total invoices: ${sumOfInvoices}`);

  const formattedResult = data.map((row) => ({
    country: row.country,
    invoices: row._count.actor
  }));

  console.table(formattedResult);

  return true;
};

getInvoiceCountries();
