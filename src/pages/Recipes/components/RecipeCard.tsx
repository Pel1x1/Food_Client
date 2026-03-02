import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Text from '@/components/Text';
import TimerIcon from '@/components/icons/TimerIcon';
import { favouritesStore } from '@/stores/favouritesStore';
import type { RecipeItem } from '@/shared/entity/recipe';
import { AppRoutePaths } from '@/shared/config/routes';
import { cardVariants } from '../config';
import { observer } from 'mobx-react-lite'; 

type Props = {
  recipe: RecipeItem;
};

const RecipeCard: React.FC<Props> = ({ recipe }) => {
  const isFavourite = favouritesStore.isFavourite(recipe.documentId);

  const handleToggleFavourite: React.MouseEventHandler<HTMLButtonElement> = (
    e,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    void favouritesStore.toggle({
      id: recipe.id,
      documentId: recipe.documentId,
      name: recipe.name,
      summary: recipe.summary,
      totalTime: recipe.totalTime,
      calories: recipe.calories,
      category: recipe.category,
      image: recipe.image,
    });
    
  };

  return (
    <motion.article
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
            <span style={{ display: 'inline', alignItems: 'center' }}>
              <TimerIcon aria-hidden="true" /> {recipe.totalTime} minutes
            </span>
          }
          title={recipe.name}
          subtitle={
            <span dangerouslySetInnerHTML={{ __html: recipe.summary }} />
          }
          contentSlot={
            <Text view="p-20" weight="medium" color="accent">
              {recipe.calories} kcal
            </Text>
          }
          actionSlot={
            <Button onClick={handleToggleFavourite}>
              <Text>{isFavourite ? 'Saved' : 'Save'}</Text>
            </Button>
          }
        />
      </Link>
    </motion.article>
  );
};

export default observer(RecipeCard);

