import { Card } from '@components/UI/Card'
import React, { useEffect, useState } from 'react'

interface Props {
  url: string
}

const IFramely: React.FC<Props> = ({ url }) => {
  const [error, setError] = useState<{ code: number; message: string } | null>(
    null
  )
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
              setError({ code: res.error, message: res.message })
            }
          },
          (error) => {
            setIsLoaded(true)
            setError(error)
          }
        )
    } else {
      setError({ code: 400, message: 'Provide url attribute for the element' })
    }
  }, [])

  useEffect(() => {
    // @ts-ignore
    window.iframely && window.iframely.load()
  })

  if (error) {
    return (
      <div>
        Error: {error.code} - {error.message}
      </div>
    )
  } else if (!isLoaded) {
    return <div>Loading...</div>
  } else {
    const title = data?.meta?.title
    const description = data?.meta?.description
    const favicon = data?.links?.icon[0]?.href

    return (
      <div className="mt-5 text-sm">
        <Card>
          <div className="p-5">
            <div className="space-y-1">
              {title && (
                <div>
                  {/* {favicon} */}
                  <div className="font-bold">{title}</div>
                </div>
              )}
              {description && <div>{description}</div>}
            </div>
          </div>
        </Card>
      </div>
    )
  }
}

export default IFramely
