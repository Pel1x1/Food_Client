//recipesStore.ts
import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';
import qs from 'qs';
import type { RecipeFromApi, RecipeItem, StrapiListResponse } from '@/shared/entity/recipe';
import { apiUrls } from '@/shared/config/api';
import { getRecipeImageUrl } from '@/shared/utils/media';

export type MealCategory = {
  id: number;
  documentId: string;
  title: string;
};

const ITEMS_PER_PAGE = 9;

export class RecipesStore {
  recipes: RecipeItem[] = [];
  categories: MealCategory[] = [];
  loading = false;
  error: string | null = null;

  searchQuery = '';
  selectedCategoryIds: number[] = [];

  draftSearchQuery = '';
  draftSelectedCategoryIds: number[] = [];
  currentPage = 1;

  total = 0;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get categoryOptions() {
    return this.categories.map((cat) => ({
      key: String(cat.id),
      value: cat.title,
    }));
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.total / ITEMS_PER_PAGE));
  }

  get paginatedRecipes() {
    return this.recipes;
  }

  setSearchQuery(value: string) {
    this.searchQuery = value;
    this.currentPage = 1;
  }

  setSelectedCategoryIds(ids: number[]) {
    this.selectedCategoryIds = ids;
    this.currentPage = 1;
  }

  setPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  setDraftSearchQuery(value: string) {
    this.draftSearchQuery = value;
  }

  setDraftSelectedCategoryIds(ids: number[]) {
    this.draftSelectedCategoryIds = ids;
  }

  async applyFilters() {
    this.searchQuery = this.draftSearchQuery;
    this.selectedCategoryIds = this.draftSelectedCategoryIds;
    this.currentPage = 1;
    await this.fetchRecipes();
  }

  hydrateFromQuery(params: URLSearchParams) {
    const search = params.get('search') ?? '';
    const pageParam = params.get('page');
    const categoriesParam = params.get('categories');

    const page = pageParam ? Number(pageParam) : 1;
    const categoryIds =
      categoriesParam
        ?.split(',')
        .map((id) => Number(id))
        .filter((id) => !Number.isNaN(id)) ?? [];

    this.searchQuery = search;
    this.currentPage = page > 0 ? page : 1;
    this.selectedCategoryIds = categoryIds;

    this.draftSearchQuery = search;
    this.draftSelectedCategoryIds = categoryIds;
  }

  toQueryParams() {
    const params: Record<string, string> = {};
    if (this.searchQuery.trim()) {
      params.search = this.searchQuery.trim();
    }
    if (this.selectedCategoryIds.length > 0) {
      params.categories = this.selectedCategoryIds.join(',');
    }
    if (this.currentPage > 1) {
      params.page = String(this.currentPage);
    }
    return params;
  }

  async fetchCategories() {
    try {
      const res = await axios.get<{ data: MealCategory[] }>(apiUrls.mealCategories);
      runInAction(() => {
        this.categories = res.data.data;
      });
    } catch (e) {
      console.error(e);
    }
  }

  async fetchRecipes() {
    try {
      this.loading = true;
      this.error = null;

      const params: Record<string, unknown> = {
        populate: ['images'],
        filters: {},
        pagination: {
          page: this.currentPage,
          pageSize: ITEMS_PER_PAGE,
        },
      };

      if (this.searchQuery.trim()) {
        (params.filters as any).name = {
          $containsi: this.searchQuery.trim(),
        };
      }

      if (this.selectedCategoryIds.length > 0) {
        (params.filters as any).category = {
          id: {
            $in: this.selectedCategoryIds,
          },
        };
      }

      const query = qs.stringify(params, { encodeValuesOnly: true });

      const res = await axios.get<StrapiListResponse<RecipeFromApi>>(
        `${apiUrls.recipes}?${query}`,
      );

      const mapped: RecipeItem[] = res.data.data.map((item) => {
        return {
          id: item.id,
          documentId: item.documentId,
          name: item.name,
          summary: item.summary || 'Нет описания',
          totalTime: String(item.totalTime ?? '0'),
          calories: String(item.calories ?? '0'),
          category: item.category?.title ?? 'All',
          image: getRecipeImageUrl(item.images),
        };
      });

      runInAction(() => {
        this.recipes = mapped;
        this.total = res.data.meta.pagination.total ?? mapped.length;
      });
    } catch (e: unknown) {
      const msg = axios.isAxiosError(e)
        ? e.response?.data?.message ?? e.message
        : e instanceof Error
        ? e.message
        : 'Ошибка загрузки рецептов';
      runInAction(() => {
        this.error = msg ?? 'Ошибка загрузки рецептов';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}
