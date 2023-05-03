import { error } from 'itty-router';

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
