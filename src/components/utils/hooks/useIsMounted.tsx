import { useEffect, useState } from 'react'

function useIsMounted() {
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return { mounted }
}

export default useIsMounted
