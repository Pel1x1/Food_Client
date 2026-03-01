import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';
import { apiUrls } from '@/shared/config/api';

export type MealCategory = {
  id: number;
  documentId: string;
  title: string;
};

class CategoriesStore {
  categories: MealCategory[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async fetchCategories() {
    this.loading = true;
    this.error = null;
    try {
      const res = await axios.get<{ data: MealCategory[] }>(
        apiUrls.mealCategories,
      );
      runInAction(() => {
        this.categories = res.data.data.filter((cat) => cat.title !== 'All');
      });
    } catch (e: unknown) {
      const msg = axios.isAxiosError(e)
        ? e.response?.data?.message ?? e.message
        : e instanceof Error
        ? e.message
        : 'Ошибка загрузки категорий';

      runInAction(() => {
        this.error = msg;
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

export const categoriesStore = new CategoriesStore();
