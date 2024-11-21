import type { ProfileInterestTypes } from "@hey/lens";
import type { ProfileInterest } from "@hey/types/misc";

/**
 * Sanitizes an array of account interests by grouping them into categories and subcategories.
 *
 * @param accountInterests Array of account interests to sanitize
 * @returns Array of sanitized account interests
 */
const sanitizeAccountInterests = (accountInterests: ProfileInterestTypes[]) => {
  if (!accountInterests) {
    return [];
  }
  const interests: ProfileInterest[] = [];
  const categories = accountInterests.filter(
    (interest) => !interest.includes("__")
  );
  for (const category of categories) {
    const subCategories = accountInterests
      .filter(
        (interest) => interest.includes(category) && interest.includes("__")
      )
      .map((item) => {
        return {
          id: item,
          label: item.toLowerCase().split("__")[1].replaceAll("_", " & ")
        };
      });
    interests.push({
      category: {
        id: category,
        label: category.replaceAll("_", " & ").toLowerCase()
      },
      subCategories
    });
  }
  return interests;
};

export default sanitizeAccountInterests;
