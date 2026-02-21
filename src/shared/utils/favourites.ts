// Утилита для управления избранными рецептами
export type FavouriteRecipe = {
  id: number;
  documentId: string;
  name: string;
  summary: string;
  totalTime: number;
  calories: number;
  category: string;
  image: string;
};

const STORAGE_KEY = 'favourite_recipes';

/**
 * Получить все избранные рецепты
 */
export const getFavouriteRecipes = (): FavouriteRecipe[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as FavouriteRecipe[];
  } catch (error) {
    console.error('Error reading favourites from localStorage:', error);
    return [];
  }
};

/**
 * Проверить, является ли рецепт избранным
 */
export const isRecipeFavourite = (documentId: string): boolean => {
  const favourites = getFavouriteRecipes();
  return favourites.some((recipe) => recipe.documentId === documentId);
};

/**
 * Добавить рецепт в избранное
 */
export const addToFavourites = (recipe: FavouriteRecipe): boolean => {
  try {
    const favourites = getFavouriteRecipes();
    
    // Проверяем, не добавлен ли уже рецепт
    if (favourites.some((r) => r.documentId === recipe.documentId)) {
      return false;
    }
    
    favourites.push(recipe);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
    return true;
  } catch (error) {
    console.error('Error adding recipe to favourites:', error);
    return false;
  }
};

/**
 * Удалить рецепт из избранного
 */
export const removeFromFavourites = (documentId: string): boolean => {
  try {
    const favourites = getFavouriteRecipes();
    const filtered = favourites.filter((r) => r.documentId !== documentId);
    
    if (filtered.length === favourites.length) {
      return false; // Рецепт не был в избранном
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error removing recipe from favourites:', error);
    return false;
  }
};

/**
 * Переключить статус избранного для рецепта
 */
export const toggleFavourite = (recipe: FavouriteRecipe): boolean => {
  if (isRecipeFavourite(recipe.documentId)) {
    return removeFromFavourites(recipe.documentId);
  } else {
    return addToFavourites(recipe);
  }
};
