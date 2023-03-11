interface EnvType {
  AIRTABLE_ACCESS_TOKEN: string;
  curated_profiles: KVNamespace;
}

export default {
  async fetch(request: Request, env: EnvType) {
    return handleScheduled(request, env);
  },
  async scheduled(request: Request, env: EnvType) {
    return await handleScheduled(request, env);
  }
};

async function handleScheduled(_request: Request, env: EnvType) {
  const listRecords = async (table: string) => {
    return await fetch(`https://api.airtable.com/v0/appv4BkOhWdkENE5C/${table}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${env.AIRTABLE_ACCESS_TOKEN}`, 'Content-type': 'application/json' }
    });
  };

  try {
    const tables = ['music', 'most_followed'];
    for (const table of tables) {
      const records = await listRecords(table);
      const result = (await records.json()) as any;
      const userIds = result.records.map((record: any) => record.fields.user_id);
      await env.curated_profiles.put(table, JSON.stringify(userIds));
    }

    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false }));
  }
}
