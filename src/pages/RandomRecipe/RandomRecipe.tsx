import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { LuDices, LuTimer, LuFlame, LuArrowRight } from 'react-icons/lu';
import Text from '@/components/Text';
import { randomRecipeStore } from '@/stores/randomRecipeStore';
import styles from './RandomRecipe.module.scss';
import { AppRoutePaths } from '@/shared/config/routes';

export const headerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const RandomRecipe: React.FC = () => {
  useEffect(() => {
    return () => randomRecipeStore.reset();
  }, []);

  const { recipe, loading, error } = randomRecipeStore;

  const handleRoll = () => {
    randomRecipeStore.fetchRandomRecipe();
  };

  return (
    <div className={styles.randomPage}>
      <div className={styles.container}>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.contentArea}>
          <AnimatePresence mode="wait">
            {!recipe ? (
              <motion.div
                key="empty-state"
                className={styles.emptyCard}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.emptyIconWrapper}>
                  <LuDices size={80} className={styles.emptyIcon} />
                </div>
                <Text view="title" tag="h2">Not sure what to cook?</Text>
                <Text view="p-16" className={styles.emptyText}>
                  Tap the button below to generate a random meal idea from our collection.
                </Text>
                
                <motion.button
                  className={styles.rollButton}
                  onClick={handleRoll}
                  disabled={loading}
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(230, 81, 0, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                      className={styles.iconWrapper}
                    >
                      <LuDices size={28} />
                    </motion.div>
                  ) : (
                    <LuDices size={28} />
                  )}
                  <span>Get Random Recipe</span>
                </motion.button>
              </motion.div>
            ) : (
              
              <motion.div
                key="result-state"
                className={styles.resultContainer}
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -40 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                <div className={styles.recipeCard}>
                  <div className={styles.imageBox}>
                    <img src={recipe.image} alt={recipe.name} />
                    <div className={styles.categoryBadge}>{recipe.category}</div>
                  </div>
                  
                  <div className={styles.infoBox}>
                    <Text view="title" tag="h2">{recipe.name}</Text>
                    
                    <div className={styles.meta}>
                      <div className={styles.metaItem}>
                        <LuTimer size={20} />
                        <Text view="p-16">{recipe.totalTime} min</Text>
                      </div>
                      <div className={styles.metaItem}>
                        <LuFlame size={20} />
                        <Text view="p-16">{Math.round(Number(recipe.calories))} kcal</Text>
                      </div>
                    </div>

                    <Text view="p-16" className={styles.summary}>
                      <div dangerouslySetInnerHTML={{ __html: recipe.summary }}></div>
                    </Text>

                    <div className={styles.actions}>
                      <Link
                        to={AppRoutePaths.recipeById(recipe.documentId)}
                        className={styles.viewBtn}
                      >
                        Cook this recipe <LuArrowRight size={20} />
                      </Link>
                      
                      
                      <motion.button
                        className={styles.rollAgainBtn}
                        onClick={handleRoll}
                        disabled={loading}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                         {loading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                          >
                            <LuDices size={20} />
                          </motion.div>
                        ) : (
                          <LuDices size={20} />
                        )}
                        <span>Roll Again</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default observer(RandomRecipe);
