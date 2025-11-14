'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/Button';
import { User, Shield, LogOut, Plus, Search, ChefHat, Award, UtensilsCrossed, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import RecipeForm from '@/components/RecipeForm';
import RecipeGrid from '@/components/RecipeGrid';
import Pagination from '@/components/Pagination';
import { recipeService } from '@/lib/recipes';
import { Recipe, CreateRecipeDTO, UpdateRecipeDTO, RecipeStats, PaginatedRecipeResponse } from '@/types';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [stats, setStats] = useState<RecipeStats | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const recipesPerPage = 12;

  const isAdmin = user?.role === 'admin';

  // Fetch recipes and stats
  useEffect(() => {
    setCurrentPage(1);
  }, [filterDifficulty, filterCategory, searchQuery]);

  useEffect(() => {
    fetchRecipes();
    fetchStats();
  }, [filterDifficulty, filterCategory, searchQuery, currentPage]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: recipesPerPage,
        sortBy: 'createdAt',
        order: 'desc'
      };
      
      if (filterDifficulty) params.difficulty = filterDifficulty;
      if (filterCategory) params.category = filterCategory;
      if (searchQuery) params.search = searchQuery;

      const response = await recipeService.getRecipes(params);
      if (response.success && response.recipes) {
        setRecipes(response.recipes);
        setTotalPages(response.totalPages);
        setTotalRecipes(response.total);
        setHasNextPage(response.hasNextPage);
        setHasPrevPage(response.hasPrevPage);
      }
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await recipeService.getRecipeStats();
      if (response.success && response.stats) {
        setStats(response.stats);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleCreateRecipe = async (data: CreateRecipeDTO) => {
    try {
      await recipeService.createRecipe(data);
      setIsFormOpen(false);
      fetchRecipes();
      fetchStats();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create recipe');
    }
  };

  const handleUpdateRecipe = async (data: UpdateRecipeDTO) => {
    if (!editingRecipe) return;
    
    try {
      await recipeService.updateRecipe(editingRecipe._id, data);
      setEditingRecipe(null);
      setIsFormOpen(false);
      fetchRecipes();
      fetchStats();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update recipe');
    }
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;

    try {
      await recipeService.deleteRecipe(recipeId);
      fetchRecipes();
      fetchStats();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete recipe');
    }
  };

  const handleToggleFeatured = async (recipeId: string) => {
    try {
      await recipeService.toggleFeatured(recipeId);
      fetchRecipes();
      fetchStats();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to toggle featured status');
    }
  };

  const handleEditClick = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsFormOpen(true);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingRecipe(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
        {/* Header */}
        <header className={`shadow-lg ${isAdmin ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gradient-to-r from-orange-600 to-red-600'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <ChefHat className="text-white" size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                    Recipe Book
                    {isAdmin && <Shield size={24} />}
                  </h1>
                  <p className="text-sm text-white/90">
                    {user?.name} • {isAdmin ? 'Admin Chef' : 'Home Chef'}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={logout}
                className="flex items-center gap-2 bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm"
              >
                <LogOut size={18} />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Recipes</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
                  </div>
                  <UtensilsCrossed className="text-orange-500" size={40} />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Featured</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.featured}</p>
                  </div>
                  <Award className="text-yellow-500" size={40} />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Avg Prep Time</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.avgPrepTime}m</p>
                  </div>
                  <div className="text-4xl">⏱️</div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Avg Cook Time</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.avgCookTime}m</p>
                  </div>
                  <div className="text-4xl">🔥</div>
                </div>
              </div>
            </div>
          )}

          {/* Category Breakdown */}
          {stats && stats.byCategory && Object.keys(stats.byCategory).length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-orange-600" />
                Recipe Categories
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {Object.entries(stats.byCategory).map(([category, count]) => (
                  <div key={category} className="text-center p-3 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg">
                    <div className="text-3xl mb-1">
                      {category === 'breakfast' && '🍳'}
                      {category === 'lunch' && '🥗'}
                      {category === 'dinner' && '🍽️'}
                      {category === 'dessert' && '🍰'}
                      {category === 'snack' && '🍿'}
                      {category === 'beverage' && '☕'}
                    </div>
                    <p className="text-xs text-gray-600 capitalize">{category}</p>
                    <p className="text-lg font-bold text-orange-600">{count}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              >
                <option value="">All Difficulties</option>
                <option value="easy">🌱 Easy</option>
                <option value="medium">📌 Medium</option>
                <option value="hard">⚡ Hard</option>
                <option value="expert">👨‍🍳 Expert</option>
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              >
                <option value="">All Categories</option>
                <option value="breakfast">🍳 Breakfast</option>
                <option value="lunch">🥗 Lunch</option>
                <option value="dinner">🍽️ Dinner</option>
                <option value="dessert">🍰 Dessert</option>
                <option value="snack">🍿 Snack</option>
                <option value="beverage">☕ Beverage</option>
              </select>

              {/* Add Recipe Button */}
              <Button
                onClick={() => {
                  setEditingRecipe(null);
                  setIsFormOpen(true);
                }}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold px-6 shadow-lg"
              >
                <Plus size={20} className="mr-2" />
                New Recipe
              </Button>
            </div>
          </div>

          {/* Form Modal */}
          {isFormOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="w-full max-w-4xl">
                <RecipeForm
                  onSubmit={editingRecipe ? handleUpdateRecipe : handleCreateRecipe}
                  onCancel={handleCancelForm}
                  initialData={editingRecipe}
                  isEdit={!!editingRecipe}
                />
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading recipes...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Recipe Grid */}
          {!loading && !error && (
            <>
              {/* Results Info */}
              <div className="mb-4 text-sm text-gray-600">
                Showing {recipes.length > 0 ? ((currentPage - 1) * recipesPerPage) + 1 : 0}-
                {Math.min(currentPage * recipesPerPage, totalRecipes)} of {totalRecipes} recipes
              </div>

              <RecipeGrid
                recipes={recipes}
                onEdit={handleEditClick}
                onDelete={handleDeleteRecipe}
                onToggleFeatured={isAdmin ? handleToggleFeatured : undefined}
                isAdmin={isAdmin}
              />

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                hasNextPage={hasNextPage}
                hasPrevPage={hasPrevPage}
              />
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
