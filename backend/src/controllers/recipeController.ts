import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Recipe from '../models/Recipe';
import { AuthRequest } from '../middleware/auth';

export const createRecipe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const {
      title,
      description,
      imageUrl,
      difficulty,
      category,
      prepTime,
      cookTime,
      servings,
      ingredients,
      instructions,
      chefNotes
    } = req.body;

    const recipe = new Recipe({
      title,
      description,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=800',
      difficulty,
      category,
      prepTime,
      cookTime,
      servings,
      ingredients,
      instructions,
      chefNotes: chefNotes || '',
      userId: req.user!._id
    });

    await recipe.save();

    res.status(201).json({
      success: true,
      message: 'Recipe created successfully',
      recipe
    });
  } catch (error: any) {
    console.error('Create recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating recipe',
      error: error.message
    });
  }
};

export const getRecipes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { 
      difficulty, 
      category, 
      search, 
      sortBy = 'createdAt', 
      order = 'desc', 
      featured,
      page = '1',
      limit = '10'
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const query: any = {};

    if (req.user!.role !== 'admin') {
      query.userId = req.user!._id;
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (category) {
      query.category = category;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOrder = order === 'desc' ? -1 : 1;
    const sortOptions: any = { [sortBy as string]: sortOrder };

    const total = await Recipe.countDocuments(query);

    const recipes = await Recipe.find(query)
      .populate('userId', 'name email role')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      count: recipes.length,
      total,
      page: pageNum,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
      recipes
    });
  } catch (error: any) {
    console.error('Get recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recipes',
      error: error.message
    });
  }
};

export const getRecipeById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const recipe = await Recipe.findById(id).populate('userId', 'name email role');

    if (!recipe) {
      res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
      return;
    }

    const recipeUserId = typeof recipe.userId === 'object' ? (recipe.userId._id as any).toString() : (recipe.userId as any).toString();
    if (req.user!.role !== 'admin' && recipeUserId !== (req.user!._id as any).toString()) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to view this recipe'
      });
      return;
    }

    res.json({
      success: true,
      recipe
    });
  } catch (error: any) {
    console.error('Get recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recipe',
      error: error.message
    });
  }
};

// Update a recipe
export const updateRecipe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const {
      title,
      description,
      imageUrl,
      difficulty,
      category,
      prepTime,
      cookTime,
      servings,
      ingredients,
      instructions,
      chefNotes
    } = req.body;

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
      return;
    }

    if (req.user!.role !== 'admin' && (recipe.userId as any).toString() !== (req.user!._id as any).toString()) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this recipe'
      });
      return;
    }

    if (title !== undefined) recipe.title = title;
    if (description !== undefined) recipe.description = description;
    if (imageUrl !== undefined) recipe.imageUrl = imageUrl;
    if (difficulty !== undefined) recipe.difficulty = difficulty;
    if (category !== undefined) recipe.category = category;
    if (prepTime !== undefined) recipe.prepTime = prepTime;
    if (cookTime !== undefined) recipe.cookTime = cookTime;
    if (servings !== undefined) recipe.servings = servings;
    if (ingredients !== undefined) recipe.ingredients = ingredients;
    if (instructions !== undefined) recipe.instructions = instructions;
    if (chefNotes !== undefined) recipe.chefNotes = chefNotes;

    await recipe.save();

    res.json({
      success: true,
      message: 'Recipe updated successfully',
      recipe
    });
  } catch (error: any) {
    console.error('Update recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating recipe',
      error: error.message
    });
  }
};

// Delete a recipe
export const deleteRecipe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
      return;
    }

    if (req.user!.role !== 'admin' && (recipe.userId as any).toString() !== (req.user!._id as any).toString()) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this recipe'
      });
      return;
    }

    await Recipe.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Recipe deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting recipe',
      error: error.message
    });
  }
};

// Toggle featured status (Admin only)
export const toggleFeatured = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user!.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Only admins can feature recipes'
      });
      return;
    }

    const { id } = req.params;
    const recipe = await Recipe.findById(id);

    if (!recipe) {
      res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
      return;
    }

    recipe.isFeatured = !recipe.isFeatured;
    await recipe.save();

    res.json({
      success: true,
      message: `Recipe ${recipe.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      recipe
    });
  } catch (error: any) {
    console.error('Toggle featured error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling featured status',
      error: error.message
    });
  }
};

// Get recipe statistics
export const getRecipeStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query: any = {};

    if (req.user!.role !== 'admin') {
      query.userId = req.user!._id;
    }

    const [
      total,
      byCategory,
      byDifficulty,
      avgPrepTime,
      avgCookTime,
      featured
    ] = await Promise.all([
      Recipe.countDocuments(query),
      Recipe.aggregate([
        { $match: query },
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]),
      Recipe.aggregate([
        { $match: query },
        { $group: { _id: '$difficulty', count: { $sum: 1 } } }
      ]),
      Recipe.aggregate([
        { $match: query },
        { $group: { _id: null, avg: { $avg: '$prepTime' } } }
      ]),
      Recipe.aggregate([
        { $match: query },
        { $group: { _id: null, avg: { $avg: '$cookTime' } } }
      ]),
      Recipe.countDocuments({ ...query, isFeatured: true })
    ]);

    const categoryStats: any = {};
    byCategory.forEach((item: any) => {
      categoryStats[item._id] = item.count;
    });

    const difficultyStats: any = {};
    byDifficulty.forEach((item: any) => {
      difficultyStats[item._id] = item.count;
    });

    res.json({
      success: true,
      stats: {
        total,
        featured,
        byCategory: categoryStats,
        byDifficulty: difficultyStats,
        avgPrepTime: avgPrepTime[0]?.avg ? Math.round(avgPrepTime[0].avg) : 0,
        avgCookTime: avgCookTime[0]?.avg ? Math.round(avgCookTime[0].avg) : 0
      }
    });
  } catch (error: any) {
    console.error('Get recipe stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recipe statistics',
      error: error.message
    });
  }
};
