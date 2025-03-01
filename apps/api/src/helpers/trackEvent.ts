import { Errors } from "@hey/data/errors";
import axios from "axios";

const trackEvent = async (event: string, metadata?: Record<string, any>) => {
  try {
    const { data } = await axios.post(
      "https://queue.simpleanalyticscdn.com/events",
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
