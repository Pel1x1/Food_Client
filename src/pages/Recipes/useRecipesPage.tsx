import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLocalObservable } from 'mobx-react-lite';
import type { Option } from '@/components/MultiDropdown';
import { RecipesStore } from '@/stores/recipesStore';

export const useRecipesPage = () => {
  const store = useLocalObservable(() => new RecipesStore());
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    store.hydrateFromQuery(searchParams);
    void store.fetchCategories();
    void store.fetchRecipes();
  }, [searchParams, store]);

  useEffect(() => {
    const params = store.toQueryParams();
    const next = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      next.set(key, value);
    });
    setSearchParams(next, { replace: true });
  }, [store.searchQuery, store.currentPage, store.selectedCategoryIds.join(','), setSearchParams]);

  const categoryOptions: Option[] = store.categoryOptions;

  const handleChangePage = (page: number) => {
    store.setPage(page);
    const gridElement = document.querySelector(
      `[data-section="search-filter"]`,
    );
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    void store.fetchRecipes();
  };

  const handleSearchClick = () => {
    void store.applyFilters();
  };

  return {
    store,
    categoryOptions,
    handleChangePage,
    handleSearchClick,
  };
};

