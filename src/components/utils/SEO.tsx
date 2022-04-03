import Head from 'next/head'
import React from 'react'

interface Props {
  title?: string
  description?: string
}

const SEO: React.FC<Props> = ({
  title = 'Lenster',
  description = 'Lenster is a composable, decentralized, and permissionless social media web app built with Lens Protocol 🌿'
}) => {
  const image = 'https://assets.lenster.xyz/images/og/logo.jpeg'

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta property="og:url" content="https://lenster.xyz" />
      <meta property="og:site_name" content="Lenster" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="400" />
      <meta property="og:image:height" content="400" />

      <meta property="twitter:site" content="Lenster" />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image:src" content={image} />
      <meta property="twitter:image:width" content="400" />
      <meta property="twitter:image:height" content="400" />
      <meta property="twitter:creator" content="lensterxyz" />

      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, viewport-fit=cover"
      />
    </Head>
  )
}

export default SEO
