// Recipe.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import Text from '@/components/Text';
import styles from './Recipe.module.scss';
import { SlArrowLeft } from "react-icons/sl";
import { LuTimer, LuUsers, LuFlame, LuHeart,LuShare2, LuPrinter  } from "react-icons/lu";
import Loader from '@/components/Loader';
import { isRecipeFavourite, toggleFavourite, type FavouriteRecipe } from '@/shared/utils/favourites';
type RecipeImage = {
  id: number;
  url: string;
  formats?: {
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
    thumbnail?: { url: string };
  };
};

type Ingredient = {
  id: number;
  name: string;
};

type Equipment = {
  id: number;
  name: string;
};

type Direction = {
  id: number;
  description: string;
  image?: RecipeImage;
};

type Category = {
  id: number;
  name: string;
};

type RecipeFromApi = {
  id: number;
  documentId: string;
  name: string;
  summary: string;
  totalTime: number;
  calories: number;
  servings?: number;
  difficulty?: string;
  images?: RecipeImage[];
  ingradients?: Ingredient[]; // как в API
  equipments?: Equipment[];
  directions?: Direction[];
  category?: Category;
};

type StrapiSingleResponse<T> = {
  data: T;
};

const Recipe: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [recipe, setRecipe] = useState<RecipeFromApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!documentId) return;

      try {
        setLoading(true);
        setError(null);

        const query = qs.stringify(
          {
            populate: ['ingradients', 'equipments', 'directions.image', 'images', 'category'],
          },
          { encodeValuesOnly: true },
        );

        const res = await axios.get<StrapiSingleResponse<RecipeFromApi>>(
          `https://front-school-strapi.ktsdev.ru/api/recipes/${documentId}?${query}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        setRecipe(res.data.data);
        // Проверяем, сохранен ли рецепт
        if (documentId) {
          setIsSaved(isRecipeFavourite(documentId));
        }
        window.scrollTo(0, 0);
      } catch (e: unknown) {
        const msg =
          axios.isAxiosError(e)
            ? e.response?.data?.message ?? e.message
            : e instanceof Error
              ? e.message
              : 'Ошибка загрузки рецепта';
        setError(msg ?? 'Ошибка загрузки рецепта');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [documentId]);

  if (loading) {
    return (
      <div className={styles.recipe}>
        <div className={styles.recipe__container}><Loader size='l'/> </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className={styles.recipe}>
        <div className={styles.recipe__container}>
          <h2>Not found</h2>
          <Link to="/" className={styles.recipe__backBtn}>
            ← Back
          </Link>
        </div>
      </div>
    );
  }

  const firstImage = recipe.images?.[0];
  const rawUrl = firstImage?.formats?.medium?.url || firstImage?.formats?.small?.url || firstImage?.url || '';
  const imageUrl = rawUrl.startsWith('http')
    ? rawUrl
    : rawUrl
    ? `https://front-school.minio.ktsdev.ru/${rawUrl.replace(/^\/+/, '')}`
    : 'https://via.placeholder.com/800x400/eee/ccc?text=No+Image';

  return (
    <div className={styles.recipe}>
      <div className={styles.recipe__hero}>
        <div className={styles.recipe__heroImgContainer}>
          <img src={imageUrl} alt={recipe.name} className={styles.recipe__heroImg} />
          <div className={styles.recipe__heroOverlayGradient}></div>
        </div>
        
        <div className={styles.recipe__heroInfoContainer}>
          <Link to="/" className={styles.recipe__backBtn}>
            <SlArrowLeft />
            <span>All recipes</span>
          </Link>
          
          {/* 
          {recipe.category && (
            <div className={styles.recipe__categoryBadge}>{recipe.category.name}</div>
          )}
            */}
          <Text view='title' className={styles.recipe__title} >{recipe.name}</Text>
          
          <div className={styles.recipe__statsStrip}>
            <div className={styles.recipe__statItem}>
              <LuTimer size={24}/>
              <Text view='title' color='accent' tag='h2' className={styles.recipe__statVal} >{recipe.totalTime} minutes</Text>
            </div>
            <div className={styles.recipe__statDivider}/>
            <div className={styles.recipe__statItem}>
               <LuUsers size={24}/>
               <Text view='title' color='accent' tag='h2' className={styles.recipe__statVal} > {recipe.servings || 1} servings</Text>
            </div>
            <div className={styles.recipe__statDivider}/>
            <div className={styles.recipe__statItem}>
              <LuFlame size={24}/>
              <Text view='title' color='accent' tag='h2' className={styles.recipe__statVal} > {Math.round(recipe.calories)} kcal</Text>
            </div>
           
          </div>
        </div>
      </div>

      <div className={styles.recipe__contentContainer}>
        <aside className={styles.recipe__sidebar}>
          <div className={`${styles.recipe__sidebarCard} ${styles.recipe__nutritionCard}`}>
            <Text tag='h3' view='p-20'>Nutritional Facts</Text>
            <div className={styles.recipe__nutritionList}>
              <div className={styles.recipe__nutritionItem}>
                <Text tag='span' view='p-16'>Proteins</Text>
                <strong>{Math.round(recipe.calories * 0.175)}</strong>
              </div>
              <div className={styles.recipe__nutritionItem}>
                <Text tag='span' view='p-16'>Fats</Text>
                <strong>{Math.round(recipe.calories * 0.275)}</strong>
              </div>
              <div className={styles.recipe__nutritionItem}>
                <Text tag='span' view='p-16'>Carbs</Text>
                <strong>{Math.round(recipe.calories * 0.5)}</strong>
              </div>
              <div className={styles.recipe__nutritionItem}>
                <Text tag='span' view='p-16'>Fibers</Text>
                <strong>{Math.round(recipe.calories * 0.03)}</strong>
              </div>
            </div>
          </div>
         

          <div className={`${styles.recipe__sidebarCard} ${styles.recipe__actionCard}`}>
            {recipe.equipments && recipe.equipments.length > 0 && (
              <div className={styles.recipe__equipmentBlock}>
                <h3 className={styles.recipe__subsectionTitle}>Equipment</h3>
                <ul className={styles.recipe__ingredientsList}>
                  {recipe.equipments.map((equipment) => (
                    <li key={equipment.id}>
                      <span className={styles.recipe__dot}></span>
                      <Text view="p-16">{equipment.name}</Text>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className={`${styles.recipe__sidebarCard} ${styles.recipe__actionCard}`}>
            <div className={styles.recipe__ingredientsEquipmentGrid}>
              <div className={styles.recipe__ingredientsBlock}>
                <h3 className={styles.recipe__subsectionTitle}>Ingredients</h3>
                <ul className={styles.recipe__ingredientsList}>
                  {recipe.ingradients?.map((ingredient) => (
                    <li key={ingredient.id}>
                      <span className={styles.recipe__dot}></span>
                      <Text view="p-16">{ingredient.name}</Text>
                    </li>
                  )) || <li>None</li>}
                </ul>
              </div>
            </div>
          </div>
           <div className={`${styles.recipe__sidebarCard} ${styles.recipe__actionCard}`}>
            <button 
              className={`${styles.recipe__actionBtnMain} ${isSaved ? styles.recipe__actionBtnMainSaved : ''}`}
              onClick={() => {
                if (!recipe || !documentId) return;
                
                const firstImage = recipe.images?.[0];
                const rawUrl = firstImage?.formats?.small?.url || firstImage?.url || '';
                const imageUrl = rawUrl.startsWith('http')
                  ? rawUrl
                  : rawUrl
                  ? `https://front-school.minio.ktsdev.ru/${rawUrl.replace(/^\/+/, '')}`
                  : 'https://via.placeholder.com/400x400/eee/ccc?text=No+Image';

                const favouriteRecipe: FavouriteRecipe = {
                  id: recipe.id,
                  documentId: recipe.documentId,
                  name: recipe.name,
                  summary: recipe.summary || 'Нет описания',
                  totalTime: recipe.totalTime || 0,
                  calories: recipe.calories || 0,
                  category: recipe.category?.name || 'All',
                  image: imageUrl,
                };
                
                toggleFavourite(favouriteRecipe);
                setIsSaved(!isSaved);
              }}
            >
              <LuHeart size={20} fill={isSaved ? "white" : "none"} />
              <span>{isSaved ? 'In favourites' : 'Add to favourites'}</span>
            </button>
            <div className={styles.recipe__secondaryActions}>
              <button className={styles.recipe__actionBtnCircle} title="Share">
                <LuShare2 size={20} />
              </button>
              <button className={styles.recipe__actionBtnCircle} title="Print">
                <LuPrinter size={20} />
              </button>
            </div>
          </div>
        </aside>
    
        <div className={styles.recipe__right}>
          <div className={styles.recipe__main}>
            <section className={styles.recipe__section}>
              <h2 className={styles.recipe__sectionTitle}>Summary</h2>
              <div className={styles.recipe__summaryText} dangerouslySetInnerHTML={{ __html: recipe.summary }} />
            </section>
          </div>

          <div className={styles.recipe__main}>
            <section className={styles.recipe__section}>
              <h2 className={styles.recipe__sectionTitle}>Instructions</h2>
              <div className={styles.recipe__stepsList}>
                {recipe.directions?.map((direction, index) => (
                  <div key={direction.id || index} className={styles.recipe__stepItem}>
                    <div className={styles.recipe__stepNumber}>
                      {index + 1 < 10 ? '0' : ''}
                      {index + 1}
                    </div>
                    <div className={styles.recipe__stepText}>
                      <h3>Step {index + 1}</h3>
                      <Text view="p-16" color="primary">
                        {direction.description}
                      </Text>
                    </div>
                  </div>
                )) || <div>No Instructions</div>}
              </div>
            </section>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Recipe;
