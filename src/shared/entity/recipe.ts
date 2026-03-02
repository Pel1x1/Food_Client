export type RecipeImage = {
  id: number;
  url: string;
  formats?: {
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
    thumbnail?: { url: string };
  };
};

export type RecipeCategory = {
  id: number;
  documentId: string;
  title: string;
};

export type RecipeFromApi = {
  id: number;
  documentId: string;
  name: string;
  summary: string;
  totalTime: number;
  calories: number;
  category?: RecipeCategory | null;
  images?: RecipeImage[];
};

export type RecipeItem = {
  id: number;
  documentId: string;
  name: string;
  summary: string;
  totalTime: string;
  calories: string;
  category: string;
  image: string;
};

export type StrapiListResponse<T> = {
  data: T[];
  meta: {
    pagination: {
      total: number;
      page: number;
      pageSize: number;
      pageCount: number;
    };
  };
};

