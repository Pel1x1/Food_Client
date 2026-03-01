import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '@/app/RootLayout';
import { AppRoutePaths } from '@/shared/config/routes';
import Recipes from '@/pages/Recipes';
import Recipe from '@/pages/Recipe';
import Categories from '@/pages/Categories';
import Favourites from '@/pages/Favourites';
import Cart from '@/pages/Cart';
import Profile from '@/pages/Profile';
import Category from '@/pages/Category';
import RandomRecipe from '@/pages/RandomRecipe';
import MealPlanning from '@/pages/MealPlanning';

export const appRouter = createBrowserRouter([
  {
    path: AppRoutePaths.home,
    element: <RootLayout />,
    children: [
      { index: true, element: <Recipes /> },
      {
        path: AppRoutePaths.recipe,
        element: <Recipe />,
      },
      {
        path: AppRoutePaths.categories,
        element: <Categories />,
      },
      {
        path: AppRoutePaths.favourites,
        element: <Favourites />,
      },
      {
        path: AppRoutePaths.cart,
        element: <Cart />,
      },

      {
        path: AppRoutePaths.profile,
        element: <Profile />,
      },
      {
        path: AppRoutePaths.category,
        element: <Category />,
      },
      {
        path: AppRoutePaths.randomRecipe,
        element: <RandomRecipe />,
      },
      {
        path: AppRoutePaths.mealPlanning,
        element: <MealPlanning />,
      },
    ],
  },
]);

