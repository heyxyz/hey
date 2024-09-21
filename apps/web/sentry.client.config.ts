import * as Sentry from "@sentry/nextjs";

Sentry.init({
  debug: false,
  dsn: "https://esWMpxsdTPu3M2u8Xhu@error.codegiant.io/202",
  enabled: process.env.NODE_ENV === "production",
  ignoreErrors: [
    "TypeError: Cannot redefine property: ethereum",
    "Error: Talisman extension has not been configured yet. Please continue with onboarding."
  ]
});
