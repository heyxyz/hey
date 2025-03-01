import { Errors } from "@hey/data/errors";
import axios from "axios";

const trackEvent = async (event: string, metadata?: Record<string, any>) => {
  try {
    if (!process.env.TRACKER_URL) {
      return null;
    }

    const { data } = await axios.post(
      process.env.TRACKER_URL,
      {
        type: "event",
        hostname: "hey.xyz",
        ua: "HeyServer/0.1 (+https://hey.xyz)",
        event,
        metadata
      },
      { headers: { "Content-Type": "application/json" } }
    );

    return data;
  } catch {
    throw new Error(Errors.SomethingWentWrong);
  }
};

export default trackEvent;
