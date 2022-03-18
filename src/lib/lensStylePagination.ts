export function lensStylePagination(keyArgs: any) {
  return {
    keyArgs: [keyArgs],
    merge(existing: any, incoming: any) {
      if (!existing) {
        return incoming
      }
      const existingItems = existing.items
      const incomingItems = incoming.items

      return {
        items: existingItems.concat(incomingItems),
        pageInfo: incoming.pageInfo
      }
    }
  }
}
