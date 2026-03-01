import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';
import { spoonacularUrls } from '@/shared/config/api';

export type TimeFrame = 'day' | 'week';

export type MealPlanMeal = {
  id: number;
  title: string;
  imageType: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
};

export type MealPlanNutrients = {
  calories: number;
  carbohydrates: number;
  fat: number;
  protein: number;
};

export type DayPlanItem = {
  dayName: string;
  meals: MealPlanMeal[];
  nutrients: MealPlanNutrients;
};

export type MealPlan = {
  days: DayPlanItem[];
  nutrients: MealPlanNutrients; 
};

export type MealInformation = {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  instructions: string;
  dishTypes: string[];
  extendedIngredients: Array<{ id: number; original: string }>;
};

type RawDayPlan = { meals: MealPlanMeal[]; nutrients: MealPlanNutrients };
type RawWeekMealPlan = { week: Record<string, RawDayPlan> };

class MealPlanningStore {
  timeFrame: TimeFrame = 'day';
  targetCalories = '';
  diet = '';
  exclude = '';

  plan: MealPlan | null = null;
  selectedMeal: MealInformation | null = null;

  loadingPlan = false;
  loadingMeal = false;
  error: string | null = null;
  mealError: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setTimeFrame(value: TimeFrame) { this.timeFrame = value; }
  setTargetCalories(value: string) { this.targetCalories = value; }
  setDiet(value: string) { this.diet = value; }
  setExclude(value: string) { this.exclude = value; }

  resetSelection() {
    this.selectedMeal = null;
    this.mealError = null;
  }

  async generatePlan() {
    const apiKey = import.meta.env.VITE_SPOONACULAR_KEY;
    if (!apiKey) { this.error = 'API key for Spoonacular is not configured.'; return; }

    this.loadingPlan = true;
    this.error = null;
    this.plan = null;
    this.selectedMeal = null;

    try {
      const params: Record<string, unknown> = { timeFrame: this.timeFrame, apiKey };
      const calories = Number(this.targetCalories);
      if (!Number.isNaN(calories) && calories > 0) params.targetCalories = calories;
      if (this.diet.trim()) params.diet = this.diet.trim();
      if (this.exclude.trim()) params.exclude = this.exclude.trim();

      const res = await axios.get<MealPlan>(spoonacularUrls.mealPlan, { params });

      runInAction(() => {
        if (this.timeFrame === 'week') {
          const weekData = res.data as unknown as RawWeekMealPlan;
          const days: DayPlanItem[] = Object.entries(weekData.week).map(([name, data]) => ({
            dayName: name.charAt(0).toUpperCase() + name.slice(1),
            meals: data.meals,
            nutrients: data.nutrients,
          }));
          this.plan = {
            days,
            nutrients: {
              calories:      days.reduce((s, d) => s + d.nutrients.calories, 0) / days.length,
              carbohydrates: days.reduce((s, d) => s + d.nutrients.carbohydrates, 0) / days.length,
              fat:           days.reduce((s, d) => s + d.nutrients.fat, 0) / days.length,
              protein:       days.reduce((s, d) => s + d.nutrients.protein, 0) / days.length,
            },
          };
        } else {
          const dayData = res.data as unknown as RawDayPlan;
          this.plan = {
            days: [{ dayName: 'Today', meals: dayData.meals, nutrients: dayData.nutrients }],
            nutrients: dayData.nutrients,
          };
        }
      });
    } catch (e) {
      runInAction(() => {
        this.error = axios.isAxiosError(e) && e.message ? e.message : 'Failed to generate meal plan';
      });
    } finally {
      runInAction(() => { this.loadingPlan = false; });
    }
  }

  async loadMealInformation(id: number) {
    const apiKey = import.meta.env.VITE_SPOONACULAR_KEY;
    if (!apiKey) { this.mealError = 'API key for Spoonacular is not configured.'; return; }

    this.loadingMeal = true;
    this.mealError = null;

    try {
      const res = await axios.get<MealInformation>(
        spoonacularUrls.recipeInformation(id),
        { params: { apiKey } },
      );
      runInAction(() => { this.selectedMeal = res.data; });
    } catch (e) {
      runInAction(() => {
        this.mealError = axios.isAxiosError(e) && e.message ? e.message : 'Failed to load meal details';
      });
    } finally {
      runInAction(() => { this.loadingMeal = false; });
    }
  }
}

export const createMealPlanningStore = () => new MealPlanningStore();
