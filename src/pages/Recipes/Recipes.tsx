// Recipes.tsx
import React from 'react';
import s from './Recipes.module.scss';
import { motion } from 'framer-motion';
import MultiDropdown from '@/components/MultiDropdown';
import { observer } from 'mobx-react-lite';
import { heroVariants, gridContainerVariants } from './config';
import { useRecipesPage } from './useRecipesPage';
import RecipesState from './components/RecipesState';
import RecipeCard from './components/RecipeCard';
import RecipesPagination from './components/RecipesPagination';

const Recipes: React.FC = () => {
  const { store, categoryOptions, handleChangePage, handleSearchClick } =
    useRecipesPage();

  return (
    <div className={s.recipes}>
      {/* Анимация Hero секции */}
      <section className={s.recipes__hero}>
        <div className={s.recipes__heroOverlay}></div>
        <motion.div 
          className={s.recipes__heroContent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={heroVariants}
        >
          <motion.h1 
            className={s.recipes__heroTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Recipes
          </motion.h1>
          <motion.p 
            className={s.recipes__heroSubtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Find the perfect food and drink ideas for every occasion, from
            weeknight dinners to holiday feasts.
          </motion.p>
        </motion.div>
      </section>

      {/* Анимация панели поиска */}
      <motion.section 
        className={s.recipes__searchFilterSection}
        data-section="search-filter"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className={s.recipes__container}>
          <div className={s.recipes__searchFilterBar}>
            <div className={s.recipes__searchInputGroup}>
              <input
                type="text"
                placeholder="Enter dishes"
                className={s.recipes__searchInput}
                value={store.draftSearchQuery}
                onChange={(e) => {
                  store.setDraftSearchQuery(e.target.value);
                }}
              />
            </div>
            <div className={s.recipes__filterGroup}>  
              <MultiDropdown
                className={s.recipes__multiDropdown}
                options={categoryOptions}
                value={categoryOptions.filter((opt) =>
                  store.draftSelectedCategoryIds.includes(Number(opt.key)),
                )}
                onChange={(val) => {
                  const ids = val
                    .map((v) => Number(v.key))
                    .filter((id) => !Number.isNaN(id));
                  store.setDraftSelectedCategoryIds(ids);
                }}
                getTitle={(val) => {
                  if (val.length === 0) return 'All categories';
                  if (val.length <= 3) return val.map((v) => v.value).join(', ');
                  return `${val.length} categories`; 
                }}
              />
              
              <button
                className={s.recipes__searchBtn}
                type="button"
                onClick={handleSearchClick}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      <section className={s.recipes__gridSection}>
        <div className={s.recipes__container}>
          <RecipesState
            loading={store.loading}
            error={store.error}
            hasContent={store.paginatedRecipes.length > 0}
          >
            <motion.div
              className={s.recipes__grid}
              variants={gridContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {store.paginatedRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </motion.div>

            <RecipesPagination
              currentPage={store.currentPage}
              totalPages={store.totalPages}
              onChangePage={handleChangePage}
            />
          </RecipesState>
        </div>
      </section>
    </div>
  );
};

export default observer(Recipes);