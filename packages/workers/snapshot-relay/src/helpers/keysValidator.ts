import { error } from 'itty-router';

/**
 * Validate keys in request body
 * @param requiredKeys Required keys
 * @param body Request body
 * @returns Error if missing keys
 */
export const keysValidator = (
  requiredKeys: string[],
  body: Record<string, any>
) => {
  const missingKeys = requiredKeys.filter(
    (key) => typeof body[key] === 'undefined'
  );
  if (missingKeys.length > 0) {
    return error(400, 'Bad request, missing keys: ' + missingKeys.join(', '));
  }
};
