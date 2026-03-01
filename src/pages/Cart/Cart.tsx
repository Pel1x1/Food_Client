// Cart.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import {
  LuShoppingCart,
  LuArrowRight,
  LuTrash2,
  LuPlus,
  LuMinus,
  LuX,
} from 'react-icons/lu';
import Text from '@/components/Text';
import { cartStore } from '@/stores/cartStore';
import styles from './Cart.module.scss';
import { motion } from 'framer-motion';
import { headerVariants } from './components/Cart.animations';
import IngredientRow from './components/IngredientRow';
import AddIngredientRow from './components/AddIngredientRow';
import { AppRoutePaths } from '@/shared/config/routes';


const Cart: React.FC = () => {
  const items = cartStore.items;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirmCheckout = () => {
    setIsModalOpen(false);
    cartStore.clear();
    alert('Thank you! Your list has been marked as purchased.');
  };

  const allIngredients = items.flatMap((item) => item.ingredients || []);

  return (
    <div className={styles.cartPage}>
      <div className={styles.container}>
        {items.length > 0 ? (
          <div>
            <motion.header
              className={styles.categoriesHeader}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={headerVariants}
            >
              <h1>Cart</h1>
              <p>
                Review your selected recipes and ingredients before checkout. 
                You can adjust quantities, edit items, or remove anything you no longer need.
              </p>
            </motion.header>

            <div className={styles.cartLayout}>
              {/* Items */}
              <div className={styles.cartList}>
                {items.map((item) => (
                  <div key={item.documentId} className={styles.cartItem}>
                    {/* Image */}
                    <div className={styles.cartItemImg}>
                      <img src={item.image} alt={item.name} />
                    </div>

                    {/* Info */}
                    <div className={styles.cartItemInfo}>
                      <Text view="p-20" weight="medium" tag="h3" className={styles.cartitemName}>
                        {item.name}
                      </Text>
                      <Text view="p-16" className={styles.cartItemMeta}>
                        {item.totalTime} min · {Math.round(item.calories)} kcal
                      </Text>

                      {/* Controls */}
                      <div className={styles.cartItemControls}>
                        <div className={styles.quantityControl}>
                          <button
                            className={styles.qBtn}
                            onClick={() =>
                              cartStore.setQuantity(
                                item.documentId,
                                item.quantity - 1,
                              )
                            }
                          >
                            <LuMinus size={14} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            className={styles.qBtn}
                            onClick={() =>
                              cartStore.setQuantity(
                                item.documentId,
                                item.quantity + 1,
                              )
                            }
                          >
                            <LuPlus size={14} />
                          </button>
                        </div>

                        <button
                          className={styles.removeBtn}
                          onClick={() => cartStore.removeItem(item.documentId)}
                          title="Remove recipe"
                        >
                          <LuTrash2 size={18} />
                        </button>
                      </div>

                      {/* Ingredients */}
                      <div className={styles.ingredientsBlock}>
                        <Text
                          view="p-16"
                          weight="medium"
                          className={styles.ingredientsTitle}
                        >
                          Ingredients
                        </Text>
                        <ul className={styles.ingredientsList}>
                          {(item.ingredients || []).map((ing) => (
                            <IngredientRow
                              key={ing.id}
                              documentId={item.documentId}
                              ingredient={ing}
                            />
                          ))}
                          <AddIngredientRow documentId={item.documentId} />
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/*Summary*/}
              <aside className={styles.cartSummary}>
                <Text view="p-20" tag="h3">
                  Order Summary
                </Text>

                <div className={styles.summaryRow}>
                  <span>Recipes</span>
                  <span>{items.length}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Total servings</span>
                  <span>{cartStore.totalItems}</span>
                </div>

                <div className={styles.summaryDivider} />

                {/* ЕДИНЫЙ СПИСОК ПОКУПОК */}
                <div className={styles.shoppingListBlock}>
                  <Text
                    view="p-16"
                    weight="medium"
                    className={styles.ingredientsTitle}
                  >
                    Your Shopping List
                  </Text>
                  <ul className={styles.shoppingList}>
                    {allIngredients.length > 0 ? (
                      allIngredients.map((ing, idx) => (
                        <li
                          key={`${ing.id}-${idx}`}
                          className={styles.shoppingListItem}
                        >
                          <span className={styles.ingredientDot} />
                          {ing.name}{' '}
                          {ing.amount &&
                            `- ${ing.amount} ${ing.unit || ''}`}
                        </li>
                      ))
                    ) : (
                      <li className={styles.shoppingListItem}>
                        No ingredients
                      </li>
                    )}
                  </ul>
                </div>

                <div className={styles.summaryDivider} />

                <button
                  className={styles.checkoutBtn}
                  onClick={() => setIsModalOpen(true)}
                >
                  Proceed to Checkout <LuArrowRight size={20} />
                </button>

                <Link to={AppRoutePaths.home} className={styles.continueShopping}>
                  Continue Shopping
                </Link>

                <button
                  className={styles.clearBtn}
                  onClick={() => cartStore.clear()}
                >
                  Clear cart
                </button>
              </aside>
            </div>
          </div>
        ) : (
          <div className={styles.emptyCart}>
            <LuShoppingCart size={80} className={styles.emptyIcon} />
            <Text view="title" tag="h2">
              Your cart is empty
            </Text>
            <Text view="p-16">
              Add ingredients from any recipe to get started!
            </Text>
            <Link to={AppRoutePaths.home} className={styles.exploreBtn}>
              Browse Recipes
            </Link>
          </div>
        )}
      </div>

      {/*Модальное окно*/}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <Text view="p-20" weight="medium" tag="h3">
                Are you sure?
              </Text>
              <button
                className={styles.iconBtn}
                onClick={() => setIsModalOpen(false)}
              >
                <LuX size={20} />
              </button>
            </div>

            <Text view="p-16" className={styles.modalText}>
              Did you buy everything on your shopping list? You have{' '}
              {allIngredients.length} items.
            </Text>

            <div className={styles.modalActions}>
              <button
                className={styles.modalCancelBtn}
                onClick={() => setIsModalOpen(false)}
              >
                No, wait
              </button>
              <button
                className={styles.modalConfirmBtn}
                onClick={handleConfirmCheckout}
              >
                Yes, I bought everything!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default observer(Cart);
