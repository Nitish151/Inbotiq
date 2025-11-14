import api from './api';
import { CreateRecipeDTO, UpdateRecipeDTO, RecipeResponse, PaginatedRecipeResponse } from '@/types';

export const recipeService = {
  // Create a new recipe
  async createRecipe(data: CreateRecipeDTO): Promise<RecipeResponse> {
    const response = await api.post('/recipes', data);
    return response.data;
  },

  // Get all recipes
  async getRecipes(params?: {
    difficulty?: string;
    category?: string;
    search?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
    featured?: boolean;
    page?: number;
    limit?: number;
  }): Promise<PaginatedRecipeResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.difficulty) queryParams.append('difficulty', params.difficulty);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.order) queryParams.append('order', params.order);
    if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());

    const url = queryParams.toString() 
      ? `/recipes?${queryParams.toString()}`
      : '/recipes';

    const response = await api.get(url);
    return response.data;
  },

  // Get single recipe by ID
  async getRecipeById(id: string): Promise<RecipeResponse> {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },

  // Update a recipe
  async updateRecipe(id: string, data: UpdateRecipeDTO): Promise<RecipeResponse> {
    const response = await api.put(`/recipes/${id}`, data);
    return response.data;
  },

  // Delete a recipe
  async deleteRecipe(id: string): Promise<RecipeResponse> {
    const response = await api.delete(`/recipes/${id}`);
    return response.data;
  },

  // Toggle featured status (Admin only)
  async toggleFeatured(id: string): Promise<RecipeResponse> {
    const response = await api.patch(`/recipes/${id}/featured`);
    return response.data;
  },

  // Get recipe statistics
  async getRecipeStats(): Promise<RecipeResponse> {
    const response = await api.get('/recipes/stats');
    return response.data;
  }
};
