import { Router } from 'express';
import { body, query } from 'express-validator';
import {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  toggleFeatured,
  getRecipeStats
} from '../controllers/recipeController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// Validation rules for ingredient
const ingredientValidation = [
  body('ingredients').isArray({ min: 2, max: 30 }).withMessage('Must have between 2 and 30 ingredients'),
  body('ingredients.*.name').trim().notEmpty().withMessage('Ingredient name is required'),
  body('ingredients.*.quantity').trim().notEmpty().withMessage('Ingredient quantity is required'),
  body('ingredients.*.unit').trim().notEmpty().withMessage('Ingredient unit is required')
];

// Validation rules for creating recipe
const createRecipeValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('imageUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Image URL must be valid'),
  body('difficulty')
    .notEmpty()
    .isIn(['easy', 'medium', 'hard', 'expert'])
    .withMessage('Difficulty must be easy, medium, hard, or expert'),
  body('category')
    .notEmpty()
    .isIn(['breakfast', 'lunch', 'dinner', 'dessert', 'snack', 'beverage'])
    .withMessage('Category must be breakfast, lunch, dinner, dessert, snack, or beverage'),
  body('prepTime')
    .notEmpty()
    .isInt({ min: 1, max: 480 })
    .withMessage('Prep time must be between 1 and 480 minutes'),
  body('cookTime')
    .notEmpty()
    .isInt({ min: 1, max: 720 })
    .withMessage('Cook time must be between 1 and 720 minutes'),
  body('servings')
    .notEmpty()
    .isInt({ min: 1, max: 50 })
    .withMessage('Servings must be between 1 and 50'),
  ...ingredientValidation,
  body('instructions')
    .isArray({ min: 2, max: 20 })
    .withMessage('Must have between 2 and 20 instruction steps'),
  body('instructions.*')
    .trim()
    .notEmpty()
    .withMessage('Each instruction step must not be empty')
    .isLength({ min: 5, max: 300 })
    .withMessage('Each step must be between 5 and 300 characters'),
  body('chefNotes')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Chef notes cannot exceed 300 characters')
];

// Validation rules for updating recipe
const updateRecipeValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('imageUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Image URL must be valid'),
  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard', 'expert'])
    .withMessage('Difficulty must be easy, medium, hard, or expert'),
  body('category')
    .optional()
    .isIn(['breakfast', 'lunch', 'dinner', 'dessert', 'snack', 'beverage'])
    .withMessage('Category must be breakfast, lunch, dinner, dessert, snack, or beverage'),
  body('prepTime')
    .optional()
    .isInt({ min: 1, max: 480 })
    .withMessage('Prep time must be between 1 and 480 minutes'),
  body('cookTime')
    .optional()
    .isInt({ min: 1, max: 720 })
    .withMessage('Cook time must be between 1 and 720 minutes'),
  body('servings')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Servings must be between 1 and 50'),
  body('ingredients')
    .optional()
    .isArray({ min: 2, max: 30 })
    .withMessage('Must have between 2 and 30 ingredients'),
  body('instructions')
    .optional()
    .isArray({ min: 2, max: 20 })
    .withMessage('Must have between 2 and 20 instruction steps'),
  body('chefNotes')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Chef notes cannot exceed 300 characters')
];

// Query validation for getting recipes
const getRecipesValidation = [
  query('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard', 'expert'])
    .withMessage('Difficulty must be easy, medium, hard, or expert'),
  query('category')
    .optional()
    .isIn(['breakfast', 'lunch', 'dinner', 'dessert', 'snack', 'beverage'])
    .withMessage('Category must be breakfast, lunch, dinner, dessert, snack, or beverage'),
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Search query must be between 1 and 50 characters'),
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'title', 'rating', 'prepTime', 'cookTime', 'difficulty'])
    .withMessage('Sort by must be createdAt, title, rating, prepTime, cookTime, or difficulty'),
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be asc or desc'),
  query('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

// Routes
router.post('/', createRecipeValidation, createRecipe);
router.get('/', getRecipesValidation, getRecipes);
router.get('/stats', getRecipeStats);
router.get('/:id', getRecipeById);
router.put('/:id', updateRecipeValidation, updateRecipe);
router.delete('/:id', deleteRecipe);
router.patch('/:id/featured', toggleFeatured);

export default router;
