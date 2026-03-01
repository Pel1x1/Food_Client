import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import s from './Category.module.scss';
import Button from '@/components/Button';
import ArrowDownIcon from '@/components/icons/ArrowDownIcon';
import Card from '@/components/Card';
import Loader from '@/components/Loader';
import Text from '@/components/Text';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { RecipesStore } from '@/stores/recipesStore';
import { favouritesStore } from '@/stores/favouritesStore';
import TimerIcon from '@/components/icons/TimerIcon';
import { AppRoutePaths } from '@/shared/config/routes';


export const gridContainerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};


export const cardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 50, 
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: 'spring',
      stiffness: 100, 
      damping: 15,
      mass: 1,
    },
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    transition: { duration: 0.2 },
  },
};


export const headerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};


const Category: React.FC = () => {
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

  const handleChangePage = (page: number) => {
    store.setPage(page);
    const gridElement = document.querySelector(`[data-section="search-filter"]`);
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    void store.fetchRecipes();
  };


  const activeCategoryTitle =
    store.selectedCategoryIds.length > 0
      ? store.categories.find((c) => c.id === store.selectedCategoryIds[0])?.title
      : undefined;

  return (
    <div className={s.recipes}>
    

        <motion.header
          className={s.categoriesHeader}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={headerVariants}
        >
          <h1>{activeCategoryTitle}</h1>
          <p>Browse recipes filtered by selected category. You can refine the search or change filters anytime.</p>
        </motion.header>

      <section className={s.recipes__gridSection}>
        <div className={s.recipes__container}>
          <AnimatePresence mode="wait">
            {store.loading && (
              <motion.div
                key="loader"
                className={s.recipes__noResults}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Loader size="l" />
                <p>Please wait while we fetch recipes.</p>
              </motion.div>
            )}

            {store.error && !store.loading && (
              <motion.div
                key="error"
                className={s.recipes__noResults}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h3>Error</h3>
                <p>{store.error}</p>
              </motion.div>
            )}

            {!store.loading && !store.error && (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className={s.recipes__grid}
                  variants={gridContainerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                >
                  <AnimatePresence mode="popLayout">
                    {store.paginatedRecipes.length > 0 ? (
                      store.paginatedRecipes.map((recipe) => (
                        <motion.div
                          key={recipe.id}
                          layout
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          whileHover={{ y: -8, transition: { duration: 0.3 } }}
                          style={{ height: '100%' }}
                        >
                          <Link
                            to={AppRoutePaths.recipeById(recipe.documentId)}
                            style={{
                              textDecoration: 'none',
                              height: '100%',
                              display: 'block',
                            }}
                          >
                            <Card
                              image={recipe.image}
                              captionSlot={
                                <span style={{ display: 'inline', alignItems: 'center' }}>
                                  <TimerIcon aria-hidden="true" /> {recipe.totalTime} minutes
                                </span>
                              }
                              title={recipe.name}
                              subtitle={
                                <span
                                  dangerouslySetInnerHTML={{ __html: recipe.summary }}
                                />
                              }
                              contentSlot={
                                <Text view="p-20" weight="medium" color="accent">
                                  {recipe.calories} kcal
                                </Text>
                              }
                              actionSlot={
                                <Button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    favouritesStore.toggle({
                                      id: recipe.id,
                                      documentId: recipe.documentId,
                                      name: recipe.name,
                                      summary: recipe.summary,
                                      totalTime: recipe.totalTime,
                                      calories: recipe.calories,
                                      category: recipe.category,
                                      image: recipe.image,
                                    });
                                  }}
                                >
                                  <Text>
                                    {favouritesStore.isFavourite(recipe.documentId)
                                      ? 'Saved'
                                      : 'Save'}
                                  </Text>
                                </Button>
                              }
                            />
                          </Link>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        className={s.recipes__noResults}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <h3>No recipes found</h3>
                        <p>Try searching for something else!</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {store.totalPages > 1 && (
                  <motion.div
                    className={s.recipes__pagination}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <button
                      className={`${s.recipes__paginationBtn} ${
                        store.currentPage === 1 ? s.recipes__paginationBtnDisabled : ''
                      }`}
                      type="button"
                      onClick={() => handleChangePage(store.currentPage - 1)}
                      disabled={store.currentPage === 1}
                    >
                      <ArrowDownIcon
                        style={{ transform: 'rotate(90deg)' }}
                        color="primary"
                      />
                    </button>

                    {Array.from({ length: store.totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          className={`${s.recipes__paginationBtn} ${
                            page === store.currentPage
                              ? s.recipes__paginationBtnActive
                              : ''
                          }`}
                          type="button"
                          onClick={() => handleChangePage(page)}
                        >
                          {page}
                        </button>
                      ),
                    )}

                    <button
                      className={`${s.recipes__paginationBtn} ${
                        store.currentPage === store.totalPages
                          ? s.recipes__paginationBtnDisabled
                          : ''
                      }`}
                      type="button"
                      onClick={() => handleChangePage(store.currentPage + 1)}
                      disabled={store.currentPage === store.totalPages}
                    >
                      <ArrowDownIcon
                        style={{ transform: 'rotate(-90deg)' }}
                        color="primary"
                      />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default observer(Category);
