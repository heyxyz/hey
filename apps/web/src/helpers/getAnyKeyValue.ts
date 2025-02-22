import type { AnyKeyValue } from "@hey/indexer";

const isAddressKeyValue = (
  kv: AnyKeyValue
): kv is { key: string; address: string; __typename: "AddressKeyValue" } =>
  kv.__typename === "AddressKeyValue";

const isBigDecimalKeyValue = (
  kv: AnyKeyValue
): kv is {
  key: string;
  bigDecimal: string;
  __typename: "BigDecimalKeyValue";
} => kv.__typename === "BigDecimalKeyValue";

const isStringKeyValue = (
  kv: AnyKeyValue
): kv is { key: string; string: string; __typename: "StringKeyValue" } =>
  kv.__typename === "StringKeyValue";

const getAnyKeyValue = (
  anyKeyValue: AnyKeyValue[],
  key: string
): { address?: string; bigDecimal?: string; string?: string } | null => {
  for (const item of anyKeyValue) {
    if (item.key === key) {
      if (isAddressKeyValue(item)) return { address: item.address };
      if (isBigDecimalKeyValue(item)) return { bigDecimal: item.bigDecimal };
      if (isStringKeyValue(item)) return { string: item.string };
    }
  }
  return null;
};

export default getAnyKeyValue;
