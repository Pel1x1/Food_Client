import React from 'react';
import { Link } from 'react-router-dom';
import Text from '@/components/Text';
import styles from './Favourites.module.scss';
import Button from '@/components/Button';
import TimerIcon from '@/components/icons/TimerIcon';
import Card from '@/components/Card';
import Loader from '@/components/Loader';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import { favouritesStore } from '@/stores/favouritesStore';
import { LuHeart } from 'react-icons/lu';
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


const Favourites: React.FC = () => {
  const favouriteRecipes = favouritesStore.items;
  const isLoading = favouritesStore.isLoading;

  if (isLoading) {
    return (
      <div className={styles.favouritesPage}>
        <div className={styles.favouritesPage__container}>
          <div className={styles.favouritesPage__noResults}>
            <Loader size="l" />
            <Text view="p-16">Loading favourites...</Text>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.favouritesPage}>
      <div className={styles.favouritesPage__container}>
        {favouriteRecipes.length === 0 ? (<div/>) : (
        <motion.header
          className={styles.favouritesPage__header}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={headerVariants}
        >
          <h1>Favourites</h1>
          <p>Your saved recipes collection. Click on any recipe to view full details.</p>
        </motion.header>
        )}

        {/* Секция с рецептами */}
        <section className={styles.favouritesPage__gridSection}>
          <AnimatePresence mode="wait">
            {favouriteRecipes.length === 0 ? (
              <motion.div 
                key="empty"
                className={styles.emptyFavourites}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <LuHeart size={80} className={styles.emptyIcon} />
                <Text view="title" tag="h2">No favourites yet</Text>
                <Text view="p-16">Start saving your favourite recipes to see them here!</Text>
                <Link to={AppRoutePaths.home} className={styles.exploreBtn}>Browse Recipes</Link>
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
                          transition: { duration: 0.3 },
                        }}
                        style={{ height: '100%' }}
                      >
                        <Link
                          to={AppRoutePaths.recipeById(recipe.documentId)}
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
                                {recipe.calories} kcal
                              </Text>
                            }
                            actionSlot={
                              <Button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  void favouritesStore.remove(recipe); 
                                }}
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
        </section>
      </div>
    </div>
  );
};

export default observer(Favourites);
