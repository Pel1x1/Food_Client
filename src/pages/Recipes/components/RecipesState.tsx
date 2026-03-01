import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '@/components/Loader';
import s from '../Recipes.module.scss';

type Props = {
  loading: boolean;
  error: string | null;
  hasContent: boolean;
  children: React.ReactNode;
};

const RecipesState: React.FC<Props> = ({
  loading,
  error,
  hasContent,
  children,
}) => {
  return (
    <AnimatePresence mode="wait">
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
          {hasContent ? (
            children
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RecipesState;

