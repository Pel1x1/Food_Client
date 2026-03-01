import React from 'react';
import { observer } from 'mobx-react-lite';
import styles from './Profile.module.scss';
import Text from '@/components/Text';
import { favouritesStore } from '@/stores/favouritesStore';
import { cartStore } from '@/stores/cartStore';
import { themeStore } from '@/stores/themeStore';
import { useLocalObservable } from 'mobx-react-lite';
import axios from 'axios';
import type { StrapiListResponse, RecipeFromApi } from '@/shared/entity/recipe';
import { apiUrls } from '@/shared/config/api';

const Profile: React.FC = () => {
  const statsStore = useLocalObservable(() => ({
    totalRecipes: 0,
    loading: false,
    error: '' as string | null,
    async fetch() {
      this.loading = true;
      this.error = null;
      try {
        const res = await axios.get<StrapiListResponse<RecipeFromApi>>(
          `${apiUrls.recipes}?pagination[limit]=1`,
        );
        this.totalRecipes = res.data.meta.pagination.total;
      } catch (e) {
        this.error =
          axios.isAxiosError(e) && e.message
            ? e.message
            : 'Failed to load stats';
      } finally {
        this.loading = false;
      }
    },
  }));

  React.useEffect(() => {
    void statsStore.fetch();
  }, [statsStore]);

  const favouritesCount = favouritesStore.items.length;
  const cartItemsCount = cartStore.totalItems;
  const uniqueCartRecipes = cartStore.items.length;

  const totalCartCalories = Math.round(
    cartStore.items.reduce(
      (sum, item) => sum + Number(item.calories || 0) * item.quantity,
      0,
    ),
  );

  const handleToggleTheme = () => {
    themeStore.toggleTheme();
  };

  const isDark = themeStore.theme === 'dark';

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileContainer}>
        <header className={styles.profileHeader}>
          <Text view="title" tag="h1">
            Profile
          </Text>
          <Text view="p-16" className={styles.profileSubtitle}>
            Personal statistics and preferences for your cooking journey.
          </Text>
        </header>

        <section className={styles.statsGrid}>
          <article className={styles.statCard}>
            <Text view="p-16" className={styles.statLabel}>
              Total recipes
            </Text>
            <Text view="title" tag="p" className={styles.statValue}>
              {statsStore.loading ? '...' : statsStore.totalRecipes}
            </Text>
          </article>

          <article className={styles.statCard}>
            <Text view="p-16" className={styles.statLabel}>
              Favourites
            </Text>
            <Text view="title" tag="p" className={styles.statValue}>
              {favouritesCount}
            </Text>
          </article>

          <article className={styles.statCard}>
            <Text view="p-16" className={styles.statLabel}>
              Items in cart
            </Text>
            <Text view="title" tag="p" className={styles.statValue}>
              {cartItemsCount}
            </Text>
          </article>

          <article className={styles.statCard}>
            <Text view="p-16" className={styles.statLabel}>
              Recipes in cart
            </Text>
            <Text view="title" tag="p" className={styles.statValue}>
              {uniqueCartRecipes}
            </Text>
          </article>

          <article className={styles.statCardWide}>
            <Text view="p-16" className={styles.statLabel}>
              Estimated calories in cart
            </Text>
            <Text view="title" tag="p" className={styles.statValue}>
              {totalCartCalories} kcal
            </Text>
          </article>
        </section>
        {/* 
        <section className={styles.preferencesSection}>
          <div className={styles.preferenceCard}>
            <div>
              <Text view="p-20" weight="medium">
                Theme
              </Text>
              <Text view="p-16" className={styles.preferenceDescription}>
                Switch between light and dark theme for more comfortable
                browsing.
              </Text>
            </div>

            
            <button
              type="button"
              className={styles.themeToggle}
              onClick={handleToggleTheme}
            >
              <span
                className={`${styles.toggleTrack} ${
                  isDark ? styles.toggleTrackActive : ''
                }`}
              >
                <span
                  className={`${styles.toggleThumb} ${
                    isDark ? styles.toggleThumbRight : ''
                  }`}
                />
              </span>
              <span className={styles.themeLabel}>
                {isDark ? 'Dark theme' : 'Light theme'}
              </span>
            </button>
          </div>
        </section>
*/}
        {statsStore.error && (
          <div className={styles.errorText}>{statsStore.error}</div>
        )}
      </div>
      
    </div>
  );
};

export default observer(Profile);
