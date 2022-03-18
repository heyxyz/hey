/**
 * Resolves normal and eth username
 * @param username - User's username
 * @returns normal or eth username
 */
export const formatUsername = (username: string | null | undefined) => {
  if (!username) return ''

  let regex = /^0x[a-fA-F0-9]{40}$/g
  if (username.match(regex)) {
    // Skip over ENS names
    if (username.includes('.')) return username

    return `${username.slice(0, 4)}…${username.slice(
      username.length - 4,
      username.length
    )}`
  } else {
    return username
  }
}
