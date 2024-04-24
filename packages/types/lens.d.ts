export type GlobalProfileStats = {
  total_acted: number;
  total_collects: number;
  total_comments: number;
  total_mirrors: number;
  total_notifications: number;
  total_posts: number;
  total_publications: number;
  total_quotes: number;
  total_reacted: number;
  total_reactions: number;
};

export type FiatRate = {
  address: string;
  decimals: number;
  fiat: number;
  name: string;
  symbol: string;
};
