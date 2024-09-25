import MailChecker from "mailchecker";

const disallowedDomains: string[] = ["mail3.me"];

const isEmailAllowed = (email: string): boolean => {
  if (!MailChecker.isValid(email)) {
    return false;
  }

  const emailDomain = email.split("@")[1];

  if (disallowedDomains.includes(emailDomain)) {
    return false;
  }

  return true;
};

export default isEmailAllowed;
