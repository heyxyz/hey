import { APP_NAME, DESCRIPTION } from 'data/constants';

const generateMeta = ({
  title = APP_NAME,
  description = DESCRIPTION,
  profileData = ''
}: {
  title?: string;
  description?: string;
  profileData?: string;
}): string => {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <title>${title}</title>
        <meta name="description" content="${description}" />
        <meta charset="UTF-8" />
        <meta property="og:url" content="https://lenster.xyz" />
        <meta property="og:site_name" content="Lenster" />
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:image" content="/og/image/profile?data=${profileData}" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:site" content="Lenster" />
        <meta property="twitter:title" content="${title}" />
        <meta property="twitter:description" content="${description}" />
        <meta property="twitter:image" content="/og/image/profile?data=${profileData}" />
        <meta property="twitter:creator" content="lensterxyz" />
      </head>
      <body>
        <h1>${title}</h1>
      </body>
    </html>`;
};

export default generateMeta;
