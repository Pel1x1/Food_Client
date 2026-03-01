//favouritesStore.ts
import { makeAutoObservable, runInAction } from 'mobx';
import type { FavouriteRecipe } from '@/shared/utils/favourites';
import { FavouritesApi } from '@/shared/utils/favourites';

class FavouritesStore {
  items: FavouriteRecipe[] = [];
  isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.load();
  }

  async load() {
    this.isLoading = true;
    try {
      const recipes = await FavouritesApi.getAll();
      runInAction(() => {
        this.items = recipes;
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  isFavourite(documentId: string): boolean {
    return this.items.some((item) => item.documentId === documentId);
  }

  async toggle(recipe: FavouriteRecipe) {
    const isFav = this.isFavourite(recipe.documentId);
    const previousItems = [...this.items];

    if (isFav) {
      runInAction(() => {
        this.items = this.items.filter((r) => r.documentId !== recipe.documentId);
      });
      
      const success = await FavouritesApi.remove(recipe.id);
      if (!success) {
        runInAction(() => {
          this.items = previousItems;
        });
      }
    } else {
      runInAction(() => {
        this.items = [...this.items, recipe];
      });
      
      const success = await FavouritesApi.add(recipe.id);
      if (!success) {
        runInAction(() => {
          this.items = previousItems;
        });
      }
    }
  }

  async remove(recipe: FavouriteRecipe) {
    const previousItems = [...this.items];
    
    runInAction(() => {
      this.items = this.items.filter((r) => r.documentId !== recipe.documentId);
    });

    const success = await FavouritesApi.remove(recipe.id);
    if (!success) {
      runInAction(() => {
        this.items = previousItems;
      });
    }
  }
}

export const favouritesStore = new FavouritesStore();