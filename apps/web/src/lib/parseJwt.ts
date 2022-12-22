/**
 *
 * @param str jwt token
 * @returns atob data
 */
const decoded = (str: string): string => Buffer.from(str, 'base64').toString('binary');

/**
 *
 * @param token jwt token
 * @returns expiry time in seconds
 */
const parseJwt = (
  token: string
): {
  exp: number;
} => {
  try {
    return JSON.parse(decoded(token.split('.')[1]));
  } catch (error) {
    console.error(error);
    return { exp: 0 };
  }
};

export default parseJwt;
