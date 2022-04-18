import { Maybe } from '@generated/types'

type Attribute = {
  key: string
  value: string
}

const getAttribute = (
  attributes: Maybe<Attribute[]> | undefined,
  query: string
): string | undefined => {
  return attributes?.find((o) => o.key === query)?.value
}

export default getAttribute
