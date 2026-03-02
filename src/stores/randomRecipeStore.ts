//randomRecipeStore.ts
import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';
import type { RecipeItem, StrapiListResponse, RecipeFromApi } from '@/shared/entity/recipe';
import { apiUrls } from '@/shared/config/api';
import { getRecipeImageUrl } from '@/shared/utils/media';

export class RandomRecipeStore {
  recipe: RecipeItem | null = null;
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async fetchRandomRecipe() {
    this.loading = true;
    this.error = null;
    this.recipe = null;

    try {
      const metaRes = await axios.get<StrapiListResponse<RecipeFromApi>>(
        `${apiUrls.recipes}?pagination[limit]=1`,
      );
      const total = metaRes.data.meta.pagination.total;

      if (total === 0) throw new Error('Рецепты не найдены');

      
      const randomStart = Math.floor(Math.random() * total);

      const res = await axios.get<StrapiListResponse<RecipeFromApi>>(
        `${apiUrls.recipes}?pagination[start]=${randomStart}&pagination[limit]=1&populate[0]=images`,
      );

      const item = res.data.data[0] as RecipeFromApi | undefined;

      if (!item) throw new Error('Не удалось получить рецепт');

      const imageUrl = getRecipeImageUrl(item.images);

      runInAction(() => {
        this.recipe = {
          id: item.id,
          documentId: item.documentId,
          name: item.name,
          summary: item.summary || 'Нет описания',
          totalTime: String(item.totalTime ?? '0'),
          calories: String(item.calories ?? '0'),
          category: item.category?.title ?? 'All',
          image: imageUrl,
        };
      });
    } catch (e: unknown) {
      const msg = axios.isAxiosError(e)
        ? e.response?.data?.message ?? e.message
        : e instanceof Error
        ? e.message
        : 'Ошибка получения случайного рецепта';
      runInAction(() => {
        this.error = msg;
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  reset() {
    this.recipe = null;
    this.error = null;
  }
}

export const randomRecipeStore = new RandomRecipeStore();
