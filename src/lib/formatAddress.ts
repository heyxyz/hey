const formatAddress = (address: string | null | undefined): string => {
  if (!address) return ''

  const regex = /^0x[a-fA-F0-9]{40}$/g
  if (address.match(regex)) {
    return `${address.slice(0, 4)}…${address.slice(
      address.length - 4,
      address.length
    )}`
  } else {
    return address
  }
}

export default formatAddress
