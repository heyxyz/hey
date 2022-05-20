const generateMeta = (title: string): string => {
  return `<!DOCTYPE html>
  <html lang="en">
    <title>${title}</title>
    <meta name="description" content="${title}" />
  
    <meta property="og:url" content="https://lenster.xyz" />
    <meta property="og:site_name" content="Lenster" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${title}" />
    <meta property="og:image" content="${title}" />
    <meta property="og:image:width" content="400" />
    <meta property="og:image:height" content="400" />
  
    <meta property="twitter:card" content="summary" />
    <meta property="twitter:site" content="Lenster" />
    <meta property="twitter:title" content="${title}" />
    <meta property="twitter:description" content="${title}" />
    <meta property="twitter:image:src" content="${title}" />
    <meta property="twitter:image:width" content="400" />
    <meta property="twitter:image:height" content="400" />
    <meta property="twitter:creator" content="lensterxyz" />
  </html>`
}

export default generateMeta
