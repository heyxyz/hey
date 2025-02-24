import type {
  AccountFollowRule,
  AccountFollowRules,
  GroupRule,
  GroupRules
} from "@hey/indexer";
import getAnyKeyValue from "./getAnyKeyValue";

interface PaymentDetails {
  assetContract: string | null;
  assetSymbol: string | null;
  amount: number | null;
}

const extractPaymentDetails = (
  rules: GroupRule[] | AccountFollowRule[]
): PaymentDetails => {
  for (const rule of rules) {
    if (rule.type === "SIMPLE_PAYMENT") {
      return {
        assetContract:
          getAnyKeyValue(rule.config, "assetContract")?.address || null,
        assetSymbol: getAnyKeyValue(rule.config, "assetSymbol")?.string || null,
        amount:
          Number(getAnyKeyValue(rule.config, "amount")?.bigDecimal) || null
      };
    }
  }
  return { assetContract: null, assetSymbol: null, amount: null };
};

export const getSimplePaymentDetails = (
  rules: GroupRules | AccountFollowRules
): PaymentDetails =>
  extractPaymentDetails(rules.required) || extractPaymentDetails(rules.anyOf);

const extractMembershipApproval = (rules: GroupRule[]): boolean => {
  for (const rule of rules) {
    if (rule.type === "MEMBERSHIP_APPROVAL") {
      return true;
    }
  }

  return false;
};

export const getMembershipApprovalDetails = (rules: GroupRules): boolean =>
  extractMembershipApproval(rules.required) ||
  extractMembershipApproval(rules.anyOf);
