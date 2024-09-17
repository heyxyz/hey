import type { ProfileInterestTypes } from "@hey/lens";
import type { ProfileInterest } from "@hey/types/misc";

/**
 * Sanitizes an array of profile interests by grouping them into categories and subcategories.
 *
 * @param profileInterests Array of profile interests to sanitize
 * @returns Array of sanitized profile interests
 */
const sanitizeProfileInterests = (profileInterests: ProfileInterestTypes[]) => {
  if (!profileInterests) {
    return [];
  }
  const interests: ProfileInterest[] = [];
  const categories = profileInterests.filter(
    (interest) => !interest.includes("__")
  );
  for (const category of categories) {
    const subCategories = profileInterests
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

export default sanitizeProfileInterests;
