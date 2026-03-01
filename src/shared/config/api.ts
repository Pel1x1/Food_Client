const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'https://front-school-strapi.ktsdev.ru/api';

const MEDIA_BASE_URL =
  import.meta.env.VITE_MEDIA_URL ?? 'https://front-school.minio.ktsdev.ru';

const SPOONACULAR_BASE_URL =
  import.meta.env.VITE_SPOONACULAR_BASE_URL ?? 'https://api.spoonacular.com';

export const apiUrls = {
  base: API_BASE_URL,
  recipes: `${API_BASE_URL}/recipes`,
  mealCategories: `${API_BASE_URL}/meal-categories`,
  favorites: `${API_BASE_URL}/favorites`,
  favoritesAdd: `${API_BASE_URL}/favorites/add`,
  favoritesRemove: `${API_BASE_URL}/favorites/remove`,
  cart: `${API_BASE_URL}/cart`,
  cartAdd: `${API_BASE_URL}/cart/add`,
  cartRemove: `${API_BASE_URL}/cart/remove`,
} as const;

export const mediaUrls = {
  base: MEDIA_BASE_URL,
} as const;

export const spoonacularUrls = {
  base: SPOONACULAR_BASE_URL,
  mealPlan: `${SPOONACULAR_BASE_URL}/mealplanner/generate`,
  recipeInformation: (id: number) =>
    `${SPOONACULAR_BASE_URL}/recipes/${id}/information`,
} as const;

