import type { EnvType } from '.';
import categories from './categories';

const handleScheduled = async (_request: Request, env: EnvType) => {
  const listRecords = async (table: string) => {
    return await fetch(`https://api.airtable.com/v0/appv4BkOhWdkENE5C/${table}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${env.AIRTABLE_ACCESS_TOKEN}`, 'Content-type': 'application/json' }
    });
  };

  try {
    for (const category of categories) {
      const records = await listRecords(category.id);
      const result = (await records.json()) as any;
      const userIds = result.records.map((record: any) => record.fields.user_id);
      await env.curated_profiles.put(category.id, JSON.stringify(userIds));
    }

    return new Response(JSON.stringify({ success: true }));
  } catch {
    return new Response(JSON.stringify({ success: false }));
  }
};

export default handleScheduled;
