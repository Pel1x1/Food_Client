// favourites.ts
import { apiUrls } from '@/shared/config/api';
import { buildMediaUrl } from '@/shared/utils/media';

export type FavouriteRecipe = {
  id: number;
  documentId: string;
  name: string;
  summary: string;
  totalTime: string;
  calories: string;
  category: string;
  image: string;
};

const JWT_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mjg5LCJpYXQiOjE3NzIyNjQ5ODYsImV4cCI6MTc3NDg1Njk4Nn0.WsJWADPnTe6H3SHJ7_QzLjMaF1r9Md5ZjEvw_u5d5aE';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${JWT_TOKEN}`,
});

type FavouriteFromApi = {
  id: number;
  documentId: string;
  originalRecipeId: number;
  recipe: {
    id: number;
    documentId: string;
    name: string;
    summary: string;
    totalTime?: number | string;
    calories?: number | string;
    category?: {
      title: string;
    } | null;
    images?: Array<{
      formats?: {
        small?: { url: string };
        medium?: { url: string };
      };
      url: string;
    }>;
  };
};

export class FavouritesApi {
  static async getAll(): Promise<FavouriteRecipe[]> {
    try {
      const response = await fetch(apiUrls.favorites, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) throw new Error('Failed to fetch favourites');

      const data = (await response.json()) as FavouriteFromApi[];

      if (!Array.isArray(data)) {
        return [];
      }

      return data.map((fav) => {
        const recipe = fav.recipe;
        const firstImage = recipe.images?.[0];
        const rawUrl =
          firstImage?.formats?.small?.url ||
          firstImage?.formats?.medium?.url ||
          firstImage?.url ||
          '';

        return {
          id: fav.originalRecipeId ?? recipe.id,
          documentId: recipe.documentId,
          name: recipe.name,
          summary: recipe.summary ?? 'No description',
          totalTime: String(recipe.totalTime ?? '0'),
          calories: String(recipe.calories ?? '0'),
          category: recipe.category?.title ?? 'All',
          image: buildMediaUrl(rawUrl),
        };
      });
    } catch (error) {
      console.error('Error fetching favourites from API:', error);
      return [];
    }
  }

  static async add(recipeId: number): Promise<boolean> {
    try {
      const response = await fetch(apiUrls.favoritesAdd, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ recipe: recipeId }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error adding recipe to favourites:', error);
      return false;
    }
  }

  static async remove(recipeId: number): Promise<boolean> {
    try {
      const response = await fetch(apiUrls.favoritesRemove, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ recipe: recipeId }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error removing recipe from favourites:', error);
      return false;
    }
  }
}
