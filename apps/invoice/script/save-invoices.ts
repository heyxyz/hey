const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const logger = require('@hey/helpers/logger');

const generatePdf = async (url: string, outputPath: string): Promise<void> => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.pdf({ format: 'A4', path: outputPath });
    await browser.close();
    logger.info(`PDF generated at ${outputPath}`);
  } catch (error) {
    logger.error('Error generating PDF:', error);
  }
};

const userHandles = ['yoginth', 'sasicodes', 'stani'];
const baseUrl = 'https://invoice.hey.xyz/signup/';
const rate = 0.63;
const outputDir = path.join(__dirname, 'pdfs');

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const generatePdfsForUsers = async (handles: string[]) => {
  for (const handle of handles) {
    const url = `${baseUrl}${handle}?rate=${rate}`;
    const outputPath = path.join(outputDir, `${handle}.pdf`);
    await generatePdf(url, outputPath);
  }
};

// Example usage
generatePdfsForUsers(userHandles);
