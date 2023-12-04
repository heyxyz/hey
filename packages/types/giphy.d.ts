export interface IGif {
  id: string;
  images: {
    original: {
      url: string;
    };
    original?: {
      url: string;
    };
    original_still: {
      url: string;
    };
  };
  slug: string;
  title: string;
}

export interface Category {
  gif: IGif;
  name: string;
  name_encoded: string;
}
