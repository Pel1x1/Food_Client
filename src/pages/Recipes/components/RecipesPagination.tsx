import React from 'react';
import { motion } from 'framer-motion';
import ArrowDownIcon from '@/components/icons/ArrowDownIcon';
import s from '../Recipes.module.scss';

type Props = {
  currentPage: number;
  totalPages: number;
  onChangePage: (page: number) => void;
};

const RecipesPagination: React.FC<Props> = ({
  currentPage,
  totalPages,
  onChangePage,
}) => {
  if (totalPages <= 1) return null;

  return (
    <motion.div
      className={s.recipes__pagination}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
    >
      <button
        className={`${s.recipes__paginationBtn} ${
          currentPage === 1 ? s.recipes__paginationBtnDisabled : ''
        }`}
        type="button"
        onClick={() => onChangePage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ArrowDownIcon style={{ transform: 'rotate(90deg)' }} />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          className={`${s.recipes__paginationBtn} ${
            page === currentPage ? s.recipes__paginationBtnActive : ''
          }`}
          type="button"
          onClick={() => onChangePage(page)}
        >
          {page}
        </button>
      ))}

      <button
        className={`${s.recipes__paginationBtn} ${
          currentPage === totalPages ? s.recipes__paginationBtnDisabled : ''
        }`}
        type="button"
        onClick={() => onChangePage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ArrowDownIcon style={{ transform: 'rotate(-90deg)' }} />
      </button>
    </motion.div>
  );
};

export default RecipesPagination;

