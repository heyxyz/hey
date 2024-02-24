import createNotionClient from './createNotionClient';

const pushToNotionDatabase = async (database_id: string, properties: any) => {
  const notion = createNotionClient();
  const newPage = await notion.pages.create({
    parent: { database_id },
    properties
  });

  return newPage;
};

export default pushToNotionDatabase;
