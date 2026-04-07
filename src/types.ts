export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  expiryDays: number;
  category: string;
  image: string;
  suggestions: string[];
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  image: string;
  tags: string[];
  time: string;
  difficulty: string;
  calories: string;
  recommendationReason: string;
  matchPercentage?: number;
  inventoryMatch?: number;
  ingredients: {
    have: { name: string; amount: string }[];
    missing: { name: string; amount: string }[];
  };
  steps?: string[];
}
