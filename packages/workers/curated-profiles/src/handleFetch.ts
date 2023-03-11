import type { EnvType } from '.';
import categories from './categories';

const handleFetch = async (request: Request, env: EnvType) => {
  const url = new URL(request.url);
  const path = url.pathname.split('/').pop();

  if (!path) {
    return new Response(JSON.stringify({ success: false, message: 'No path provided' }));
  }

  try {
    if (path === 'categories') {
      const allCategories = await Promise.all(
        categories.map(async (category) => {
          const users = await env.curated_profiles.get(category.id);
          return {
            id: category.id,
            name: category.name,
            users: JSON.parse(users as string).length
          };
        })
      );

      return new Response(JSON.stringify({ success: true, categories: allCategories }));
    }

    const users = await env.curated_profiles.get(path);
    const response = new Response(JSON.stringify({ success: true, users: JSON.parse(users as string) }));
    response.headers.set('Cache-Control', 'max-age=18000, s-maxage=18000, stale-while-revalidate=18000');

    return response;
  } catch {
    return new Response(JSON.stringify({ success: false, message: 'Something went wrong!' }));
  }
};

export default handleFetch;
