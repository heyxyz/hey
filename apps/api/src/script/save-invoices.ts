import lensPg from '@hey/db/lensPg';
import logger from '@hey/helpers/logger';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const baseUrl = 'http://localhost:4786/signup/';
const rate = 70;
const outputDir = path.join(__dirname, 'pdfs');
const startDate = '2024-06-01 00:07:17';
const endDate = '2024-06-30 23:58:57';
const batchSize = 7;

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

const generatePdf = async (
  url: string,
  outputPath: string,
  blockTimestamp: Date
) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.pdf({ format: 'A4', path: outputPath });
    await browser.close();

    const year = blockTimestamp.getFullYear();
    const month = String(blockTimestamp.getMonth() + 1).padStart(2, '0');
    const day = String(blockTimestamp.getDate()).padStart(2, '0');
    const hours = String(blockTimestamp.getHours()).padStart(2, '0');
    const minutes = String(blockTimestamp.getMinutes()).padStart(2, '0');
    const seconds = String(blockTimestamp.getSeconds()).padStart(2, '0');
    const formattedTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    logger.info(`PDF generated at ${outputPath} at ${formattedTimestamp}`);
  } catch (error) {
    logger.error('Error generating PDF:', error as Error);
  }
};

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const generatePdfsForUsers = async () => {
  const profiles = await getProfiles();

  for (let i = 0; i < profiles.length; i += batchSize) {
    const batch = profiles.slice(i, i + batchSize);
    const pdfPromises = batch.map(async (profile) => {
      const url = `${baseUrl}${profile.profile_id}?rate=${rate}`;
      const outputPath = path.join(
        outputDir,
        `Invoice #${parseInt(profile.profile_id)}.pdf`
      );
      await generatePdf(url, outputPath, profile.block_timestamp);
    });

    await Promise.all(pdfPromises);
  }
};

generatePdfsForUsers();
