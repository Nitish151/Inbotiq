export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: any[];
  error?: string;
}

// Recipe Types
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type Category = 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'snack' | 'beverage';

export interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

export interface Recipe {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  difficulty: Difficulty;
  category: Category;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  rating: number;
  ratingCount: number;
  isFeatured: boolean;
  chefNotes: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    role: string;
  } | string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecipeDTO {
  title: string;
  description: string;
  imageUrl?: string;
  difficulty: Difficulty;
  category: Category;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  chefNotes?: string;
}

export interface UpdateRecipeDTO {
  title?: string;
  description?: string;
  imageUrl?: string;
  difficulty?: Difficulty;
  category?: Category;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  ingredients?: Ingredient[];
  instructions?: string[];
  chefNotes?: string;
}

export interface RecipeStats {
  total: number;
  featured: number;
  byCategory: Record<Category, number>;
  byDifficulty: Record<Difficulty, number>;
  avgPrepTime: number;
  avgCookTime: number;
}

export interface RecipeResponse {
  success: boolean;
  message?: string;
  recipe?: Recipe;
  recipes?: Recipe[];
  count?: number;
  stats?: RecipeStats;
}

export interface PaginatedRecipeResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  recipes: Recipe[];
}
