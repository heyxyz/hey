import dotenv from "dotenv";

dotenv.config({ override: true });

const TEST_AUTH_TOKEN = process.env.TEST_AUTH_TOKEN;

const getTestAuthHeaders = () => {
  return {
    "X-Access-Token": TEST_AUTH_TOKEN,
    "X-Identity-Token": TEST_AUTH_TOKEN
  };
};

export default getTestAuthHeaders;
