import { Client } from '@notionhq/client';

const createNotionClient = () => {
  return new Client({
    auth: process.env.NOTION_TOKEN
  });
};

export default createNotionClient;
