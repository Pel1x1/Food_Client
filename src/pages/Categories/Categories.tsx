import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  LuChefHat,
  LuPizza,
  LuSalad,
  LuIceCreamCone,
  LuCookie,
  LuUtensils,
  LuCroissant,
  LuBeef,
  LuSoup,
  LuCoffee,
  LuEgg,
  LuDroplets,
} from 'react-icons/lu';
import { categoriesStore } from '@/stores/categoriesStore';
import styles from './Categories.module.scss';
import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { AppRoutePaths } from '@/shared/config/routes';

const CategoryIcon: React.FC<{ name: string }> = ({ name }) => {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('main')) return <LuBeef size={32} />;
  if (lowerName.includes('side')) return <LuSalad size={32} />;
  if (lowerName.includes('breakfast')) return <LuEgg size={32} />;
  if (lowerName.includes('dessert')) return <LuIceCreamCone size={32} />;
  if (lowerName.includes('appetizer')) return <LuUtensils size={32} />;
  if (lowerName.includes('salad')) return <LuSalad size={32} />;
  if (lowerName.includes('bread')) return <LuCroissant size={32} />;
  if (lowerName.includes('soup')) return <LuSoup size={32} />;
  if (lowerName.includes('beverage')) return <LuCoffee size={32} />;
  if (lowerName.includes('sauce') || lowerName.includes('marinade')) return <LuDroplets size={32} />;
  if (lowerName.includes('fingerfood')) return <LuPizza size={32} />;
  if (lowerName.includes('snack')) return <LuCookie size={32} />;
  

  return <LuChefHat size={32} />;
};

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


const Categories: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    categoriesStore.fetchCategories();
  }, []);

  const { categories, loading, error } = categoriesStore;

  const handleCategoryClick = (categoryId: number) => {
    navigate(`${AppRoutePaths.category}?categories=${categoryId}`);
  };

  return (
    <div className={styles.categoriesPage}>
      <div className={styles.categoriesContainer}>
        
        <motion.header
          className={styles.categoriesHeader}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={headerVariants}
        >
          <h1>Explore Categories</h1>
          <p>Browse our hand-picked collection by cuisine or type.</p>
        </motion.header>

        {loading && <div className={styles.categoriesMessage}>Loading categories...</div>}
        {error && <div className={styles.categoriesMessage}>{error}</div>}

        {!loading && !error && (
          <motion.div className={styles.categoriesGrid}
            variants={gridContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {categories.map((cat) => (
              <motion.div 
                key={cat.id} 
                className={styles.categoryCard}
                variants={cardVariants}
              >
                <div className={styles.categoryIconWrapper}>
                  <CategoryIcon name={cat.title} />
                </div>
                <h3>{cat.title}</h3>
                <p>Delicious {cat.title.toLowerCase()} recipes for you.</p>
                
                <button 
                  className={styles.categoryBtn}
                  onClick={() => handleCategoryClick(cat.id)}
                >
                  Browse All
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}

      </div>
    </div>
  );
};


export default observer(Categories);
