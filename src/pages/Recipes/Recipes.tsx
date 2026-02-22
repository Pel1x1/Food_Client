// Recipes.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import Text from '@/components/Text';
import s from './Recipes.module.scss';
import type { Option as MultiOption } from '@/components/MultiDropdown';
import Button from '@/components/Button';
import TimerIcon from '@/components/icons/TimerIcon';
import ArrowDownIcon from '@/components/icons/ArrowDownIcon';
import Card from '@/components/Card';
import Loader from '@/components/Loader';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { toggleFavourite, isRecipeFavourite, type FavouriteRecipe } from '@/shared/utils/favourites';
import MultiDropdown, { type Option } from '@/components/MultiDropdown';


export type RecipeImage = {
  id: number;
  url: string;
  formats?: {
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
    thumbnail?: { url: string };
  };
};

type RecipeFromApi = {
  id: number;
  documentId: string;
  name: string;
  summary: string;
  totalTime: number;
  calories: number;
  category?: string;
  images?: RecipeImage[];
};

type RecipeItem = {
  id: number;
  documentId: string;
  name: string;
  summary: string;
  totalTime: number;
  calories: number;
  category: string;
  image: string;
};

type StrapiListResponse<T> = {
  data: T[];
  meta: {
    pagination: {
      total: number;
      page: number;
      pageSize: number;
      pageCount: number;
    };
  };
};

// Анимация контейнера
const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Анимация отдельной карточки
const cardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 50, 
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: 'spring',
      stiffness: 100, 
      damping: 15,
      mass: 1 
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    transition: { duration: 0.2 } 
  }
};

// Анимация Hero
const heroVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

type MealCategory = {
  id: number;
  documentId: string;
  title: string;
};


const ITEMS_PER_PAGE = 9;

const Recipes: React.FC = () => {
  const [recipes, setRecipes] = useState<RecipeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<Set<string>>(new Set());

  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<MealCategory[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Option[]>([]);
  const categoryOptions: Option[] = categories.map((cat) => ({
    key: String(cat.id),
    value: cat.title,
  }));


  const [currentPage, setCurrentPage] = useState(1);

  // Загружаем сохраненные рецепты при монтировании и когда меняются рецепты
  useEffect(() => {
    if (recipes.length > 0) {
      const favourites = recipes
        .filter((r) => isRecipeFavourite(r.documentId))
        .map((r) => r.documentId);
      setSavedRecipes(new Set(favourites));
    }
  }, [recipes]);

  useEffect(() => {
    axios
      .get<{ data: MealCategory[] }>(
        'https://front-school-strapi.ktsdev.ru/api/meal-categories',
      )
      .then((res) => setCategories(res.data.data))
      .catch(console.error);
  }, []);

    useEffect(() => {
      const fetchRecipes = async () => {
        try {
          setLoading(true);
          setError(null);

          const selectedIds = selectedCategories.map((c) => Number(c.key));

          const params: Record<string, unknown> = {
            populate: ['images'],
          };

          if (selectedIds.length > 0) {
            params['filters'] = {
              category: { id: { $in: selectedIds } },
            };
          }

          const query = qs.stringify(params, { encodeValuesOnly: true });

          const res = await axios.get<StrapiListResponse<RecipeFromApi>>(
            `https://front-school-strapi.ktsdev.ru/api/recipes?${query}`,
          );

          const mapped: RecipeItem[] = res.data.data.map((item) => {
            const firstImage = item.images?.[0];
            const rawUrl = firstImage?.formats?.small?.url || firstImage?.url || '';
            const imageUrl =
              rawUrl && rawUrl.startsWith('http')
                ? rawUrl
                : rawUrl
                ? `https://front-school.minio.ktsdev.ru/${rawUrl.replace(/^\/+/, '')}`
                : 'https://via.placeholder.com/400x400/eee/ccc?text=No+Image';

            return {
              id: item.id,
              documentId: item.documentId,
              name: item.name,
              summary: item.summary || 'Нет описания',
              totalTime: item.totalTime || 0,
              calories: item.calories || 0,
              category: item.category || 'All',
              image: imageUrl,
            };
          });

          setRecipes(mapped);
        } catch (e: unknown) {
          const msg = axios.isAxiosError(e)
            ? e.response?.data?.message ?? e.message
            : e instanceof Error ? e.message : 'Ошибка загрузки рецептов';
          setError(msg ?? 'Ошибка загрузки рецептов');
        } finally {
          setLoading(false);
        }
      };

      fetchRecipes();
    }, [selectedCategories]); // ← перезапрос при смене категории


  const filteredRecipes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return recipes;
    return recipes.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q),
    );
  }, [recipes, searchQuery]);


  const totalPages = Math.ceil(filteredRecipes.length / ITEMS_PER_PAGE);

  const paginatedRecipes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRecipes.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRecipes, currentPage]);

  const handleChangePage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    const gridElement = document.querySelector(`[data-section="search-filter"]`);
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className={s.recipes__filterGroup}>
              <MultiDropdown
                className={s.recipes__multiDropdown}
                options={categoryOptions}
                value={selectedCategories}
                onChange={(val) => {
                  setSelectedCategories(val);
                  setCurrentPage(1);
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
                onClick={() => setCurrentPage(1)}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      <section className={s.recipes__gridSection}>
        <div className={s.recipes__container}>
          {/* Анимация лоадера */}
          <AnimatePresence mode='wait'>
            {loading && (
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

            {error && !loading && (
              <motion.div 
                key="error"
                className={s.recipes__noResults}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h3>Error</h3>
                <p>{error}</p>
              </motion.div>
            )}

            {!loading && !error && (
              <motion.div 
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                
                  {/* анимациядля Grid контейнера. */}

                <motion.div 
                  className={s.recipes__grid}
                  variants={gridContainerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                >
                  <AnimatePresence mode='popLayout'>
                    {paginatedRecipes.length > 0 ? (
                      paginatedRecipes.map((recipe) => (
                        <motion.div
                          key={recipe.id}
                          layout
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          whileHover={{ 
                            y: -8, 
                            transition: { duration: 0.3 } 
                          }}
                          style={{ height: '100%' }} 
                        >
                          <Link
                            to={`/recipe/${recipe.documentId}`}
                            style={{ textDecoration: 'none', height: '100%', display: 'block' }}
                          >
                            <Card
                              image={recipe.image}
                              captionSlot={
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                  <TimerIcon aria-hidden="true" />
                                  {recipe.totalTime} minutes
                                </span>
                              }
                              title={recipe.name}
                              subtitle={<span dangerouslySetInnerHTML={{ __html: recipe.summary }} />}
                              contentSlot={
                                <Text view="p-20" weight="medium" color="accent">
                                  {Math.round(recipe.calories)} kcal
                                </Text>
                              }
                              actionSlot={
                                <Button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const favouriteRecipe: FavouriteRecipe = {
                                      id: recipe.id,
                                      documentId: recipe.documentId,
                                      name: recipe.name,
                                      summary: recipe.summary,
                                      totalTime: recipe.totalTime,
                                      calories: recipe.calories,
                                      category: recipe.category,
                                      image: recipe.image,
                                    };
                                    toggleFavourite(favouriteRecipe);
                                    // Обновляем состояние сохраненных рецептов
                                    setSavedRecipes((prev) => {
                                      const newSet = new Set(prev);
                                      if (newSet.has(recipe.documentId)) {
                                        newSet.delete(recipe.documentId);
                                      } else {
                                        newSet.add(recipe.documentId);
                                      }
                                      return newSet;
                                    });
                                  }}
                                >
                                  {savedRecipes.has(recipe.documentId) ? 'Saved' : 'Save'}
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

                {totalPages > 1 && (
                  <motion.div 
                    className={s.recipes__pagination}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <button
                      className={`${s.recipes__paginationBtn} ${currentPage === 1 ? s.recipes__paginationBtnDisabled : ''}`}
                      type="button"
                      onClick={() => handleChangePage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ArrowDownIcon style={{ transform: 'rotate(90deg)' }} color="primary" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        className={`${s.recipes__paginationBtn} ${page === currentPage ? s.recipes__paginationBtnActive : ''}`}
                        type="button"
                        onClick={() => handleChangePage(page)}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      className={`${s.recipes__paginationBtn} ${currentPage === totalPages ? s.recipes__paginationBtnDisabled : ''}`}
                      type="button"
                      onClick={() => handleChangePage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ArrowDownIcon style={{ transform: 'rotate(-90deg)' }} color="primary" />
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

export default Recipes;