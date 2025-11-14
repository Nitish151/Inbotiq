'use client';

import { Recipe } from '@/types';
import { Edit2, Trash2, Clock, Users, ChefHat, Star, Award } from 'lucide-react';
import Image from 'next/image';

interface RecipeGridProps {
  recipes: Recipe[];
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipeId: string) => void;
  onToggleFeatured?: (recipeId: string) => void;
  isAdmin?: boolean;
}

const difficultyConfig = {
  easy: { color: 'bg-green-100 text-green-800 border-green-300', icon: '🌱', label: 'Easy' },
  medium: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: '📌', label: 'Medium' },
  hard: { color: 'bg-orange-100 text-orange-800 border-orange-300', icon: '⚡', label: 'Hard' },
  expert: { color: 'bg-red-100 text-red-800 border-red-300', icon: '👨‍🍳', label: 'Expert' }
};

const categoryConfig = {
  breakfast: { icon: '🍳', label: 'Breakfast' },
  lunch: { icon: '🥗', label: 'Lunch' },
  dinner: { icon: '🍽️', label: 'Dinner' },
  dessert: { icon: '🍰', label: 'Dessert' },
  snack: { icon: '🍿', label: 'Snack' },
  beverage: { icon: '☕', label: 'Beverage' }
};

export default function RecipeGrid({ recipes, onEdit, onDelete, onToggleFeatured, isAdmin = false }: RecipeGridProps) {
  if (recipes.length === 0) {
    return (
      <div className="text-center py-16 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg border-2 border-dashed border-orange-300">
        <ChefHat className="mx-auto text-orange-400 mb-4" size={64} />
        <p className="text-gray-600 text-lg font-semibold">No recipes found</p>
        <p className="text-gray-500 text-sm mt-2">Create your first recipe to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => {
        const difficulty = difficultyConfig[recipe.difficulty];
        const category = categoryConfig[recipe.category];
        const totalTime = recipe.prepTime + recipe.cookTime;
        const userName = typeof recipe.userId === 'object' ? recipe.userId.name : '';

        return (
          <div
            key={recipe._id}
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group relative"
          >
            {/* Featured Badge */}
            {recipe.isFeatured && (
              <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                <Award size={14} />
                Featured
              </div>
            )}

            {/* Image */}
            <div className="relative h-48 bg-gradient-to-br from-orange-100 to-yellow-100 overflow-hidden">
              <img
                src={recipe.imageUrl || 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=800'}
                alt={recipe.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=800';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Content */}
            <div className="p-5">
              {/* Title & Category */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1">
                  {recipe.title}
                </h3>
                <span className="text-2xl flex-shrink-0">{category.icon}</span>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {recipe.description}
              </p>

              {/* Meta Info Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={16} className="text-orange-500" />
                  <span className="font-medium">{totalTime} min</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users size={16} className="text-blue-500" />
                  <span className="font-medium">{recipe.servings} servings</span>
                </div>
              </div>

              {/* Difficulty Badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${difficulty.color}`}>
                  <span>{difficulty.icon}</span>
                  {difficulty.label}
                </span>
                <span className="text-xs text-gray-500">
                  {recipe.ingredients.length} ingredients
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                <Star className="text-yellow-500 fill-yellow-500" size={16} />
                <span className="font-semibold text-gray-900">
                  {recipe.rating > 0 ? recipe.rating.toFixed(1) : 'New'}
                </span>
                {recipe.ratingCount > 0 && (
                  <span className="text-xs text-gray-500">
                    ({recipe.ratingCount} {recipe.ratingCount === 1 ? 'rating' : 'ratings'})
                  </span>
                )}
              </div>

              {/* User Info (Admin View) */}
              {isAdmin && userName && (
                <div className="mb-3 text-xs text-gray-500 flex items-center gap-1">
                  <ChefHat size={14} />
                  <span>By {userName}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(recipe)}
                  className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(recipe._id)}
                  className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
                {isAdmin && onToggleFeatured && (
                  <button
                    onClick={() => onToggleFeatured(recipe._id)}
                    className={`px-3 py-2 rounded-lg transition-colors flex items-center justify-center ${
                      recipe.isFeatured
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={recipe.isFeatured ? 'Unfeature' : 'Feature'}
                  >
                    <Award size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
