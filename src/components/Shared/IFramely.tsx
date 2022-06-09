import { Card } from '@components/UI/Card'
import imagekitURL from '@lib/imagekitURL'
import trackEvent from '@lib/trackEvent'
import React, { FC, useEffect, useState } from 'react'

interface Props {
  url: string
}

const IFramely: FC<Props> = ({ url }) => {
  const [error, setError] = useState<boolean>(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [data, setData] = useState<any>()

  useEffect(() => {
    if (url) {
      fetch(
        `https://iframe.ly/api/iframely?api_key=258c8580bd477c9b886b49&url=${url}`
      )
        .then((res) => res.json())
        .then((res) => {
          setIsLoaded(true)
          if (!res.error) {
            setData(res)
          } else {
            setError(true)
          }
        })
        .catch(() => {
          setIsLoaded(true)
          setError(true)
        })
    } else {
      setError(true)
    }
  }, [url])

  useEffect(() => {
    ;(window as any).iframely && (window as any).iframely.load()
  })

  if (error || !isLoaded) {
    return null
  } else {
    const og = {
      title: data?.meta?.title,
      description: data?.meta?.description,
      site: data?.meta?.site,
      url: data?.url,
      favicon: `https://www.google.com/s2/favicons?domain=${url}`,
      thumbnail:
        data?.links?.thumbnail &&
        imagekitURL(data?.links?.thumbnail[0]?.href, 'attachment'),
      isSquare:
        data?.links?.thumbnail &&
        data?.links?.thumbnail[0]?.media?.width ===
          data?.links?.thumbnail[0]?.media?.height
    }

    if (!og.title) return null

    return (
      <div className="mt-4 text-sm sm:w-4/6">
        <a
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => trackEvent('oembed')}
        >
          <Card forceRounded>
            {!og.isSquare && og.thumbnail && (
              <img
                className="w-full rounded-t-xl"
                src={og.thumbnail}
                alt="Thumbnail"
              />
            )}
            <div className="flex items-center">
              {og.isSquare && og.thumbnail && (
                <img
                  className="w-36 h-36 rounded-l-xl"
                  height={144}
                  width={144}
                  src={og.thumbnail}
                  alt="Thumbnail"
                />
              )}
              <div className="p-5 truncate">
                <div className="space-y-1.5">
                  {og.title && (
                    <div className="font-bold line-clamp-1">{og.title}</div>
                  )}
                  {og.description && (
                    <div className="text-gray-500 line-clamp-2">
                      {og.description}
                    </div>
                  )}
                  {og.site && (
                    <div className="flex items-center pt-1.5 space-x-1">
                      {og.favicon && (
                        <img
                          className="w-4 h-4 rounded-full"
                          height={16}
                          width={16}
                          src={og.favicon}
                          alt="Favicon"
                        />
                      )}
                      <div className="text-xs text-gray-500">{og.site}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </a>
      </div>
    )
  }
}

export default IFramely
