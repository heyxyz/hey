export interface IGif {
  id: string;
  title: string;
  slug: string;
  images: {
    original: {
      url: string;
    };
    original_still: {
      url: string;
    };
    original?: {
      url: string;
    };
  };
}

export interface Category {
  name: string;
  name_encoded: string;
  gif: IGif;
}
