import { makeAutoObservable, runInAction, autorun } from 'mobx';
import { apiUrls } from '@/shared/config/api';

export type CartIngredient = {
  id: number;
  name: string;
  amount: string;
  unit?: string;
};

export type CartItem = {
  documentId: string;
  name: string;
  image: string;
  calories: number;
  totalTime: number;
  quantity: number;
  ingredients: CartIngredient[];
};

const JWT_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mjg5LCJpYXQiOjE3NzIyNjQ5ODYsImV4cCI6MTc3NDg1Njk4Nn0.WsJWADPnTe6H3SHJ7_QzLjMaF1r9Md5ZjEvw_u5d5aE';

const CART_SYNC_PRODUCT_ID = 156;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${JWT_TOKEN}`,
});

class CartStore {
  items: CartItem[] = [];
  syncing = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    // 1. При загрузке страницы достаем корзину из localStorage
    const savedCart = localStorage.getItem('recipe_cart');
    if (savedCart) {
      try {
        this.items = JSON.parse(savedCart);
      } catch (e) {
        console.error('Failed to parse cart from local storage', e);
        this.items = [];
      }
    }

    // 2. MobX autorun: автоматически сохраняем items в localStorage 
    // при любом их изменении (добавление, удаление, редактирование ингредиентов)
    autorun(() => {
      localStorage.setItem('recipe_cart', JSON.stringify(this.items));
    });
  }

  get totalItems() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  private async syncAdd(quantity: number) {
    if (quantity <= 0) return;
    this.syncing = true;
    try {
      await fetch(apiUrls.cartAdd, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          product: CART_SYNC_PRODUCT_ID,
          quantity,
        }),
      });
    } catch (e) {
      console.error('Error syncing add to cart with Strapi', e);
    } finally {
      runInAction(() => {
        this.syncing = false;
      });
    }
  }

  private async syncRemove(quantity: number) {
    if (quantity <= 0) return;
    this.syncing = true;
    try {
      await fetch(apiUrls.cartRemove, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          product: CART_SYNC_PRODUCT_ID,
          quantity,
        }),
      });
    } catch (e) {
      console.error('Error syncing remove from cart with Strapi', e);
    } finally {
      runInAction(() => {
        this.syncing = false;
      });
    }
  }

  addItem(payload: Omit<CartItem, 'quantity'>, quantity = 1) {
    const existing = this.items.find(
      (i) => i.documentId === payload.documentId,
    );
    const newIngredients = (payload.ingredients || []).map((ing) => ({
      ...ing,
      amount: ing.amount || '',
    }));

    if (existing) {
      existing.quantity += quantity;
      existing.ingredients = existing.ingredients || [];

      newIngredients.forEach((ing) => {
        if (!existing.ingredients.find((e) => e.id === ing.id)) {
          existing.ingredients.push({ ...ing });
        }
      });
    } else {
      this.items.push({ ...payload, quantity, ingredients: newIngredients });
    }

    void this.syncAdd(quantity);
  }

  removeItem(documentId: string) {
    const item = this.items.find((i) => i.documentId === documentId);
    if (!item) return;
    const qty = item.quantity;
    this.items = this.items.filter((i) => i.documentId !== documentId);
    void this.syncRemove(qty);
  }

  // --- Ingredient editing ---

  addIngredient(documentId: string, name: string, amount: string = '') {
    const item = this.items.find((i) => i.documentId === documentId);
    if (!item || !name.trim()) return;
    const newId = Date.now();
    item.ingredients.push({
      id: newId,
      name: name.trim(),
      amount: amount.trim(),
    });
  }

  removeIngredient(documentId: string, ingredientId: number) {
    const item = this.items.find((i) => i.documentId === documentId);
    if (!item) return;
    item.ingredients = item.ingredients.filter((ing) => ing.id !== ingredientId);
  }

  updateIngredient(
    documentId: string,
    ingredientId: number,
    name: string,
    amount: string,
  ) {
    const item = this.items.find((i) => i.documentId === documentId);
    if (!item || !name.trim()) return;
    const ing = item.ingredients.find((i) => i.id === ingredientId);
    if (ing) {
      ing.name = name.trim();
      ing.amount = amount.trim();
    }
  }

  setQuantity(documentId: string, quantity: number) {
    const item = this.items.find((i) => i.documentId === documentId);
    if (!item) return;

    const prev = item.quantity;

    if (quantity <= 0) {
      this.removeItem(documentId);
      return;
    }

    item.quantity = quantity;

    const diff = quantity - prev;
    if (diff > 0) {
      void this.syncAdd(diff);
    } else if (diff < 0) {
      void this.syncRemove(-diff);
    }
  }

  clear() {
    const total = this.totalItems;
    this.items = [];
    if (total > 0) {
      void this.syncRemove(total);
    }
  }
}

export const cartStore = new CartStore();
