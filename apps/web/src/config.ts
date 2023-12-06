export const rewrites = [
  {
    destination: 'https://api.hey.xyz/sitemap/:match*',
    source: '/sitemaps/:match*'
  },
  {
    destination: 'https://rishi.app',
    has: [
      {
        key: 'user-agent',
        type: 'header',
        value:
          '.*twitterbot|linkedinbot|whatsapp|slackbot|telegrambot|discordbot|facebookbot.*'
      }
    ],
    source: '/u/(.*)'
  },
  {
    destination: 'https://rishi.app',
    has: [
      {
        key: 'user-agent',
        type: 'header',
        value:
          '.*twitterbot|linkedinbot|whatsapp|slackbot|telegrambot|discordbot|facebookbot.*'
      }
    ],
    source: '/u/lens/(.*)'
  },
  {
    destination: 'https://rishi.app',
    has: [
      {
        key: 'user-agent',
        type: 'header',
        value:
          '.*twitterbot|linkedinbot|whatsapp|slackbot|telegrambot|discordbot|facebookbot.*'
      }
    ],
    source: '/posts/(.*)'
  }
];
