//recipeStore.ts
import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';
import qs from 'qs';
import type { RecipeImage } from '@/shared/entity/recipe';
import { apiUrls } from '@/shared/config/api';
import { buildMediaUrl } from '@/shared/utils/media';

type Ingredient = {
  id: number;
  name: string;
  amount?: string;
  unit?: string;
};

type Equipment = {
  id: number;
  name: string;
};

type Direction = {
  id: number;
  description: string;
  image?: RecipeImage;
};

type Category = {
  id: number;
  name: string;
};

export type RecipeFromApi = {
  id: number;
  documentId: string;
  name: string;
  summary: string;
  totalTime: string;
  calories: string;
  servings?: number;
  difficulty?: string;
  images?: RecipeImage[];
  ingradients?: Ingredient[];
  equipments?: Equipment[];
  directions?: Direction[];
  category?: Category;
   amount?: string;
   unit?: string;
};

type StrapiSingleResponse<T> = {
  data: T;
};

export class RecipeStore {
  recipe: RecipeFromApi | null = null;
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get mainImageUrl(): string {
    if (!this.recipe)
      return 'https://via.placeholder.com/800x400/eee/ccc?text=No+Image';
    const firstImage = this.recipe.images?.[0];
    const rawUrl =
      firstImage?.formats?.medium?.url ||
      firstImage?.formats?.small?.url ||
      firstImage?.url ||
      '';
    if (!rawUrl) {
      return 'https://via.placeholder.com/800x400/eee/ccc?text=No+Image';
    }
    return buildMediaUrl(rawUrl);
  }

  async fetchRecipe(documentId: string) {
    try {
      this.loading = true;
      this.error = null;

      const query = qs.stringify(
        {
          populate: ['ingradients', 'equipments', 'directions.image', 'images', 'category'],
        },
        { encodeValuesOnly: true },
      );

      const res = await axios.get<StrapiSingleResponse<RecipeFromApi>>(
        `${apiUrls.recipes}/${documentId}?${query}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      runInAction(() => {
        this.recipe = res.data.data;
      });
      window.scrollTo(0, 0);
    } catch (e: unknown) {
      const msg =
        axios.isAxiosError(e)
          ? e.response?.data?.message ?? e.message
          : e instanceof Error
          ? e.message
          : 'Ошибка загрузки рецепта';
      runInAction(() => {
        this.error = msg ?? 'Ошибка загрузки рецепта';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

