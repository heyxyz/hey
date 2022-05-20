const generateMeta = (
  title: string | null = 'Lenster',
  description:
    | string
    | null = 'Lenster is a composable, decentralized, and permissionless social media web app built with Lens Protocol 🌿',
  image: string | null = 'https://assets.lenster.xyz/images/og/logo.jpeg'
): string => {
  return `<!DOCTYPE html>
  <html lang="en">
    <title>${title}</title>
    <meta name="description" content="${title}" />
  
    <meta property="og:url" content="https://lenster.xyz" />
    <meta property="og:site_name" content="Lenster" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="400" />
    <meta property="og:image:height" content="400" />
  
    <meta property="twitter:card" content="summary" />
    <meta property="twitter:site" content="Lenster" />
    <meta property="twitter:title" content="${title}" />
    <meta property="twitter:description" content="${description}" />
    <meta property="twitter:image:src" content="${image}" />
    <meta property="twitter:image:width" content="400" />
    <meta property="twitter:image:height" content="400" />
    <meta property="twitter:creator" content="lensterxyz" />
  </html>`
}

export default generateMeta
