import logger from '@hey/helpers/logger';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

import lensPg from '../db/lensPg';

const baseUrl = 'https://invoice.hey.xyz/signup/';
const rate = 83;
const outputDir = path.join(__dirname, 'pdfs');
const startDate = new Date('2024-02-20');
const endDate = new Date('2024-02-29');

const getProfiles = async () => {
  const profiles = await lensPg.query(
    `
      SELECT profile_id FROM app.onboarding_profile
      WHERE onboarded_by_address = $1
      AND block_timestamp BETWEEN $2 AND $3;
    `,
    ['0x4b8845ACb8148dE64D1D99Cf27A3890a91F55E53', startDate, endDate]
  );

  return profiles.map((profile) => profile.profile_id);
};

const generatePdf = async (url: string, outputPath: string): Promise<void> => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.pdf({ format: 'A4', path: outputPath });
    await browser.close();
    logger.info(`PDF generated at ${outputPath}`);
  } catch (error) {
    logger.error('Error generating PDF:', error as Error);
  }
};

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const generatePdfsForUsers = async () => {
  const ids = await getProfiles();

  for (const id of ids) {
    const url = `${baseUrl}${id}?rate=${rate}`;
    const outputPath = path.join(outputDir, `Invoice #${parseInt(id)}.pdf`);
    await generatePdf(url, outputPath);
  }
};

generatePdfsForUsers();
