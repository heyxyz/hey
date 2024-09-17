import { createClient } from "@clickhouse/client";
import dotenv from "dotenv";

dotenv.config({ override: true });

const clickhouseClient = createClient({
  compression: { request: true, response: true },
  keep_alive: { enabled: true },
  password: process.env.CLICKHOUSE_PASSWORD,
  url: process.env.CLICKHOUSE_URL,
  username: "clickhouse"
});

export default clickhouseClient;
