import { allowedNamespaces } from "@hey/data/allowed-namespaces";

const getNamespace = (namespace: string): string | null => {
  const entry = allowedNamespaces.find((ns) => namespace in ns);
  return entry ? (entry[namespace as keyof typeof entry] ?? null) : null;
};

export default getNamespace;
