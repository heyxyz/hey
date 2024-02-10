import zendesk from 'node-zendesk';

const createZendeskClient = () => {
  return zendesk.createClient({
    subdomain: 'heyxyz',
    token: process.env.ZENDESK_API_KEY,
    username: 'yoginth@hey.com'
  });
};

export default createZendeskClient;
