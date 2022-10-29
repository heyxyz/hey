import type { ChildrenNode } from 'interweave';

interface LinkProps {
  children: React.ReactNode;
  href: string;
  key?: number | string;
  newWindow?: boolean;
  onClick?: () => null | void;
}

export interface UrlProps extends Partial<LinkProps> {
  children: ChildrenNode;
  url: string;
  urlParts: {
    auth: string;
    fragment: string;
    host: string;
    path: string;
    port: number | string;
    query: string;
    scheme: string;
  };
}

export interface UrlMatcherOptions {
  customTLDs?: string[];
  validateTLD?: boolean;
}
