export const AppRoutePaths = {
  home: '/',
  recipe: '/recipe/:documentId',
  recipeById: (documentId: string) => `/recipe/${documentId}`,
  categories: '/categories',
  favourites: '/favourites',
  cart: '/cart',
  profile: '/profile',
  category: '/category',
  randomRecipe: '/randomrecipe',
  mealPlanning: '/meal-planning',
} as const;

