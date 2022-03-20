import { Card } from '@components/UI/Card'
import React, { useEffect, useState } from 'react'

interface Props {
  url: string
}

const IFramely: React.FC<Props> = ({ url }) => {
  const [error, setError] = useState<boolean>(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [data, setData] = useState<any>()

  useEffect(() => {
    if (url) {
      fetch(
        `https://iframe.ly/api/iframely?api_key=258c8580bd477c9b886b49&url=${url}`
      )
        .then((res) => res.json())
        .then(
          (res) => {
            setIsLoaded(true)
            if (res) {
              setData(res)
            } else if (res.error) {
              setError(true)
            }
          },
          () => {
            setIsLoaded(true)
            setError(true)
          }
        )
    } else {
      setError(true)
    }
  }, [])

  useEffect(() => {
    // @ts-ignore
    window.iframely && window.iframely.load()
  })

  if (error || !isLoaded) {
    return null
  } else {
    const title = data?.meta?.title
    const description = data?.meta?.description
    const site = data?.meta?.site
    const url = data?.url
    const favicon = data?.links?.icon[0]?.href
    const thumbnail = data?.links?.thumbnail[0]?.href
    const isSquare =
      data?.links?.thumbnail[0]?.media?.width ===
      data?.links?.thumbnail[0]?.media?.height

    return (
      <div className="w-2/3 mt-4 text-sm">
        <a href={url} target="_blank" rel="noreferrer">
          <Card>
            {!isSquare && thumbnail && (
              <img
                className="w-full rounded-t-xl"
                src={thumbnail}
                alt="Thumbnail"
              />
            )}
            <div className="flex items-center">
              {isSquare && thumbnail && (
                <img
                  className="h-32 rounded-l-xl"
                  src={thumbnail}
                  alt="Thumbnail"
                />
              )}
              <div className="p-5">
                <div className="space-y-2">
                  {title && (
                    <div className="font-bold line-clamp-1">{title}</div>
                  )}
                  {description && (
                    <div className="text-gray-500 line-clamp-2">
                      {description}
                    </div>
                  )}
                  {site && (
                    <div className="flex items-center pt-1 space-x-1">
                      {favicon && (
                        <img
                          className="w-4 h-4 rounded-full"
                          src={favicon}
                          alt="Favicon"
                        />
                      )}
                      <div className="text-xs text-gray-500">{site}</div>
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
