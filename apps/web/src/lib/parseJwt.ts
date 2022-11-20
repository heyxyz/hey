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
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    console.error(error);
    return { exp: 0 };
  }
};

export default parseJwt;
