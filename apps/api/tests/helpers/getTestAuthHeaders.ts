import { TEST_AUTH_TOKEN } from "./constants";

const getTestAuthHeaders = (type: "user" | "admin" | "gardener") => {
  const token =
    type === "user"
      ? TEST_AUTH_TOKEN
      : type === "admin"
        ? TEST_AUTH_TOKEN
        : type === "gardener"
          ? TEST_AUTH_TOKEN
          : null;

  return {
    "X-Access-Token": token,
    "X-Identity-Token": token
  };
};

export default getTestAuthHeaders;
