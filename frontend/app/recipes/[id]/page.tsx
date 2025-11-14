'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Recipe } from '@/types';
import { getRecipeById } from '@/lib/recipes';
import { Clock, Users, ChefHat, ArrowLeft, Award } from 'lucide-react';

const difficultyConfig: Record<'easy' | 'medium' | 'hard' | 'expert', { color: string; icon: string; label: string }> = {
  easy: { color: 'bg-green-100 text-green-800 border-green-300', icon: '🌱', label: 'Easy' },
  medium: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: '📌', label: 'Medium' },
  hard: { color: 'bg-orange-100 text-orange-800 border-orange-300', icon: '⚡', label: 'Hard' },
  expert: { color: 'bg-red-100 text-red-800 border-red-300', icon: '👨‍🍳', label: 'Expert' }
};

const categoryConfig: Record<'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'snack' | 'beverage', { icon: string; label: string }> = {
  breakfast: { icon: '🍳', label: 'Breakfast' },
  lunch: { icon: '🥗', label: 'Lunch' },
  dinner: { icon: '🍽️', label: 'Dinner' },
  dessert: { icon: '🍰', label: 'Dessert' },
  snack: { icon: '🍿', label: 'Snack' },
  beverage: { icon: '☕', label: 'Beverage' }
};

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const response = await getRecipeById(params.id as string);
        setRecipe(response.recipe || null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchRecipe();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="mx-auto text-orange-500 animate-bounce mb-4" size={64} />
          <p className="text-gray-600 text-lg">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || 'Recipe not found'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const difficultyKey = (recipe.difficulty as keyof typeof difficultyConfig) ?? 'easy';
  const difficulty = difficultyConfig[difficultyKey] || difficultyConfig.easy;
  const categoryKey = (recipe.category as keyof typeof categoryConfig) ?? 'dinner';
  const category = categoryConfig[categoryKey] || categoryConfig.dinner;
  const totalTime = recipe.prepTime + recipe.cookTime;
  const userName = typeof recipe.userId === 'object' ? recipe.userId.name : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/dashboard')}
          className="mb-6 flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        {/* Recipe Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Image */}
          <div className="relative h-96 bg-gradient-to-br from-orange-100 to-yellow-100">
            {recipe.isFeatured && (
              <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                <Award size={18} />
                Featured Recipe
              </div>
            )}
            <img
              src={recipe.imageUrl || 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=800'}
              alt={recipe.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=800';
              }}
            />
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Title & Category */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-4xl font-bold text-gray-900">{recipe.title}</h1>
              <span className="text-4xl">{category.icon}</span>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-lg mb-6">{recipe.description}</p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 mb-6 pb-6 border-b">
              <div className="flex items-center gap-2 text-gray-700">
                <Clock size={20} className="text-orange-500" />
                <span className="font-medium">Prep: {recipe.prepTime} min</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock size={20} className="text-red-500" />
                <span className="font-medium">Cook: {recipe.cookTime} min</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock size={20} className="text-blue-500" />
                <span className="font-medium">Total: {totalTime} min</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Users size={20} className="text-purple-500" />
                <span className="font-medium">{recipe.servings} servings</span>
              </div>
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${difficulty.color}`}>
                <span>{difficulty.icon}</span>
                {difficulty.label}
              </span>
            </div>

            {/* Chef Info */}
            {userName && (
              <div className="mb-6 flex items-center gap-2 text-gray-600">
                <ChefHat size={20} />
                <span className="font-medium">Created by {userName}</span>
              </div>
            )}

            {/* Ingredients */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                🛒 Ingredients
              </h2>
              <div className="bg-orange-50 rounded-lg p-6">
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700">
                      <span className="text-orange-500 font-bold mt-1">•</span>
                      <span>
                        <span className="font-semibold">{ingredient.quantity} {ingredient.unit}</span> {ingredient.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Instructions */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                📝 Instructions
              </h2>
              <div className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 pt-1">{instruction}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Chef Notes */}
            {recipe.chefNotes && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  👨‍🍳 Chef's Notes
                </h3>
                <p className="text-gray-700">{recipe.chefNotes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
