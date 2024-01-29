import zendesk from 'node-zendesk';

const createZendeskClient = () => {
  return zendesk.createClient({
    subdomain: 'heyxyz',
    token: process.env.ZENDESK_API_KEY,
    username: 'yogi@hey.xyz'
  });
};

export default createZendeskClient;
