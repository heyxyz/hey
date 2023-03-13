import handleFetch from './handleFetch';
import handleScheduled from './handleScheduled';

export interface EnvType {
  AIRTABLE_ACCESS_TOKEN: string;
  curated_profiles: KVNamespace;
}

export default {
  async fetch(request: Request, env: EnvType) {
    return handleFetch(request, env);
  },
  async scheduled(request: Request, env: EnvType) {
    return await handleScheduled(request, env);
  }
};
