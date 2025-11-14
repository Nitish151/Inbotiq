'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, ChefHat } from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';
import { Select } from './Select';
import { CreateRecipeDTO, Recipe, Ingredient } from '@/types';

const ingredientSchema = z.object({
  name: z.string().min(1, 'Ingredient name required'),
  quantity: z.string().min(1, 'Quantity required'),
  unit: z.string().min(1, 'Unit required')
});

const recipeSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description cannot exceed 500 characters'),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  difficulty: z.enum(['easy', 'medium', 'hard', 'expert']),
  category: z.enum(['breakfast', 'lunch', 'dinner', 'dessert', 'snack', 'beverage']),
  prepTime: z.number().min(1, 'Prep time must be at least 1 minute').max(480),
  cookTime: z.number().min(1, 'Cook time must be at least 1 minute').max(720),
  servings: z.number().min(1, 'Must serve at least 1 person').max(50),
  ingredients: z.array(ingredientSchema).min(2, 'At least 2 ingredients required').max(30, 'Maximum 30 ingredients'),
  instructions: z.array(z.string().min(5, 'Step must be at least 5 characters').max(300)).min(2, 'At least 2 steps required').max(20, 'Maximum 20 steps'),
  chefNotes: z.string().max(300, 'Chef notes cannot exceed 300 characters').optional()
});

type RecipeFormData = z.infer<typeof recipeSchema>;

interface RecipeFormProps {
  onSubmit: (data: CreateRecipeDTO) => Promise<void>;
  onCancel: () => void;
  initialData?: Recipe | null;
  isEdit?: boolean;
}

export default function RecipeForm({ onSubmit, onCancel, initialData, isEdit = false }: RecipeFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      description: initialData.description,
      imageUrl: initialData.imageUrl,
      difficulty: initialData.difficulty,
      category: initialData.category,
      prepTime: initialData.prepTime,
      cookTime: initialData.cookTime,
      servings: initialData.servings,
      ingredients: initialData.ingredients,
      instructions: initialData.instructions,
      chefNotes: initialData.chefNotes
    } : {
      difficulty: 'medium',
      category: 'dinner',
      prepTime: 15,
      cookTime: 30,
      servings: 4,
      ingredients: [{ name: '', quantity: '', unit: '' }],
      instructions: [''],
      imageUrl: '',
      chefNotes: ''
    }
  });

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control,
    name: 'ingredients'
  });

  const { fields: instructionFields, append: appendInstruction, remove: removeInstruction } = useFieldArray({
    control,
    name: 'instructions' as any
  });

  const handleFormSubmit = async (data: RecipeFormData) => {
    const submitData: CreateRecipeDTO = {
      ...data,
      prepTime: Number(data.prepTime),
      cookTime: Number(data.cookTime),
      servings: Number(data.servings),
      imageUrl: data.imageUrl || undefined
    };
    await onSubmit(submitData);
  };

  const difficultyOptions = [
    { value: 'easy', label: '🌱 Easy' },
    { value: 'medium', label: '📌 Medium' },
    { value: 'hard', label: '⚡ Hard' },
    { value: 'expert', label: '👨‍🍳 Expert' }
  ];

  const categoryOptions = [
    { value: 'breakfast', label: '🍳 Breakfast' },
    { value: 'lunch', label: '🥗 Lunch' },
    { value: 'dinner', label: '🍽️ Dinner' },
    { value: 'dessert', label: '🍰 Dessert' },
    { value: 'snack', label: '🍿 Snack' },
    { value: 'beverage', label: '☕ Beverage' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <ChefHat className="text-orange-600" size={32} />
        <h2 className="text-2xl font-bold text-gray-800">
          {isEdit ? 'Edit Recipe' : 'Create New Recipe'}
        </h2>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Basic Information</h3>
          
          <Input
            label="Recipe Title"
            type="text"
            error={errors.title?.message}
            {...register('title')}
            placeholder="e.g., Chocolate Chip Cookies"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
              placeholder="Brief description of your recipe..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <Input
            label="Image URL"
            type="url"
            error={errors.imageUrl?.message}
            {...register('imageUrl')}
            placeholder="https://example.com/image.jpg (optional)"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Difficulty Level"
              options={difficultyOptions}
              error={errors.difficulty?.message}
              {...register('difficulty')}
            />

            <Select
              label="Category"
              options={categoryOptions}
              error={errors.category?.message}
              {...register('category')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Prep Time (min)"
              type="number"
              error={errors.prepTime?.message}
              {...register('prepTime', { valueAsNumber: true })}
              placeholder="15"
            />

            <Input
              label="Cook Time (min)"
              type="number"
              error={errors.cookTime?.message}
              {...register('cookTime', { valueAsNumber: true })}
              placeholder="30"
            />

            <Input
              label="Servings"
              type="number"
              error={errors.servings?.message}
              {...register('servings', { valueAsNumber: true })}
              placeholder="4"
            />
          </div>
        </div>

        {/* Ingredients */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-lg font-semibold text-gray-700">Ingredients</h3>
            <Button
              type="button"
              onClick={() => appendIngredient({ name: '', quantity: '', unit: '' })}
              variant="secondary"
              disabled={ingredientFields.length >= 30}
              className="text-sm"
            >
              <Plus size={16} className="mr-1" /> Add
            </Button>
          </div>

          <div className="space-y-3">
            {ingredientFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <input
                  {...register(`ingredients.${index}.name`)}
                  placeholder="Ingredient name"
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
                <input
                  {...register(`ingredients.${index}.quantity`)}
                  placeholder="Qty"
                  className="w-20 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
                <input
                  {...register(`ingredients.${index}.unit`)}
                  placeholder="Unit"
                  className="w-24 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
                {ingredientFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
          {errors.ingredients && (
            <p className="text-sm text-red-600">{errors.ingredients.message}</p>
          )}
        </div>

        {/* Instructions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-lg font-semibold text-gray-700">Instructions</h3>
            <Button
              type="button"
              onClick={() => appendInstruction('' as any)}
              variant="secondary"
              disabled={instructionFields.length >= 20}
              className="text-sm"
            >
              <Plus size={16} className="mr-1" /> Add Step
            </Button>
          </div>

          <div className="space-y-3">
            {instructionFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center font-semibold text-sm">
                  {index + 1}
                </span>
                <textarea
                  {...register(`instructions.${index}`)}
                  rows={2}
                  placeholder={`Step ${index + 1} instructions...`}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm resize-none"
                />
                {instructionFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeInstruction(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
          {errors.instructions && (
            <p className="text-sm text-red-600">{errors.instructions.message}</p>
          )}
        </div>

        {/* Chef Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chef's Notes (Optional)
          </label>
          <textarea
            {...register('chefNotes')}
            rows={2}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
            placeholder="Any tips or variations..."
          />
          {errors.chefNotes && (
            <p className="mt-1 text-sm text-red-600">{errors.chefNotes.message}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-orange-600 hover:bg-orange-700"
          >
            {isSubmitting ? 'Saving...' : (isEdit ? 'Update Recipe' : 'Create Recipe')}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            variant="secondary"
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
