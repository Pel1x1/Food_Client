import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Text from '@/components/Text';
import styles from './Favourites.module.scss';
import Button from '@/components/Button';
import TimerIcon from '@/components/icons/TimerIcon';
import Card from '@/components/Card';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { getFavouriteRecipes, removeFromFavourites, type FavouriteRecipe } from '@/shared/utils/favourites';
import { LuHeart } from 'react-icons/lu';

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

const Favourites: React.FC = () => {
  const [favouriteRecipes, setFavouriteRecipes] = useState<FavouriteRecipe[]>([]);

  useEffect(() => {
    // Загружаем избранные рецепты при монтировании
    const favourites = getFavouriteRecipes();
    setFavouriteRecipes(favourites);
  }, []);

  const handleRemoveFromFavourites = (documentId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromFavourites(documentId);
    setFavouriteRecipes((prev) => prev.filter((r) => r.documentId !== documentId));
  };

  return (
    <div className={styles.favouritesPage}>
      {/* Hero секция */}
      <section className={styles.favouritesPage__hero}>
        <div className={styles.favouritesPage__heroOverlay}></div>
        <motion.div 
          className={styles.favouritesPage__heroContent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={heroVariants}
        >
          <motion.h1 
            className={styles.favouritesPage__heroTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Favourites
          </motion.h1>
          <motion.p 
            className={styles.favouritesPage__heroSubtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Your saved recipes collection. Click on any recipe to view full details.
          </motion.p>
        </motion.div>
      </section>

      {/* Секция с рецептами */}
      <section className={styles.favouritesPage__gridSection}>
        <div className={styles.favouritesPage__container}>
          <AnimatePresence mode="wait">
            {favouriteRecipes.length === 0 ? (
              <motion.div 
                key="empty"
                className={styles.favouritesPage__noResults}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LuHeart size={64} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                <h3>No favourites yet</h3>
                <p>Start saving your favourite recipes to see them here!</p>
                <Link to="/">
                  <Button style={{ marginTop: '1rem' }}>Browse Recipes</Button>
                </Link>
              </motion.div>
            ) : (
              <motion.div 
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div 
                  className={styles.favouritesPage__grid}
                  variants={gridContainerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                >
                  <AnimatePresence mode="popLayout">
                    {favouriteRecipes.map((recipe) => (
                      <motion.div
                        key={recipe.documentId}
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
                            subtitle={recipe.summary}
                            contentSlot={
                              <Text view="p-20" weight="medium" color="accent">
                                {Math.round(recipe.calories)} kcal
                              </Text>
                            }
                            actionSlot={
                              <Button
                                onClick={(e) => handleRemoveFromFavourites(recipe.documentId, e)}
                              >
                                <LuHeart size={16} fill="currentColor" style={{ marginRight: '4px' }} />
                                Remove
                              </Button>
                            }
                          />
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default Favourites;
