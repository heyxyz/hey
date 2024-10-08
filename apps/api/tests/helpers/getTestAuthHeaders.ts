const TEST_AUTH_TOKEN = process.env.TEST_AUTH_TOKEN;
const TEST_SUSPENDED_AUTH_TOKEN = process.env.TEST_SUSPENDED_AUTH_TOKEN;

const getTestAuthHeaders = (type: "default" | "suspended" = "default") => {
  switch (type) {
    case "suspended":
      return {
        "X-Access-Token": TEST_SUSPENDED_AUTH_TOKEN,
        "X-Identity-Token": TEST_SUSPENDED_AUTH_TOKEN
      };
    default:
      return {
        "X-Access-Token": TEST_AUTH_TOKEN,
        "X-Identity-Token": TEST_AUTH_TOKEN
      };
  }
};

export default getTestAuthHeaders;
