import { bannedEmailDomains } from "@hey/data/banned-email-domains";
import MailChecker from "mailchecker";

const isEmailAllowed = (email: string): boolean => {
  if (!MailChecker.isValid(email)) {
    return false;
  }

  const emailDomain = email.split("@")[1];

  if (bannedEmailDomains.includes(emailDomain)) {
    return false;
  }

  return true;
};

export default isEmailAllowed;
