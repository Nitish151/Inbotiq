import mongoose, { Document, Schema } from 'mongoose';

export interface IIngredient {
  name: string;
  quantity: string;
  unit: string;
}

export interface IRecipe extends Document {
  title: string;
  description: string;
  imageUrl: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  category: 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'snack' | 'beverage';
  prepTime: number; 
  cookTime: number; 
  servings: number;
  ingredients: IIngredient[];
  instructions: string[];
  rating: number;
  ratingCount: number;
  isFeatured: boolean;
  chefNotes: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ingredientSchema = new Schema<IIngredient>({
  name: {
    type: String,
    required: [true, 'Ingredient name is required'],
    trim: true
  },
  quantity: {
    type: String,
    required: [true, 'Quantity is required'],
    trim: true
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    trim: true
  }
}, { _id: false });

const recipeSchema = new Schema<IRecipe>(
  {
    title: {
      type: String,
      required: [true, 'Recipe title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Recipe description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    imageUrl: {
      type: String,
      required: [true, 'Recipe image is required'],
      trim: true,
      default: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=800'
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'expert'],
      default: 'medium',
      required: true
    },
    category: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'dessert', 'snack', 'beverage'],
      required: [true, 'Category is required']
    },
    prepTime: {
      type: Number,
      required: [true, 'Prep time is required'],
      min: [1, 'Prep time must be at least 1 minute'],
      max: [480, 'Prep time cannot exceed 8 hours']
    },
    cookTime: {
      type: Number,
      required: [true, 'Cook time is required'],
      min: [1, 'Cook time must be at least 1 minute'],
      max: [720, 'Cook time cannot exceed 12 hours']
    },
    servings: {
      type: Number,
      required: [true, 'Servings count is required'],
      min: [1, 'Must serve at least 1 person'],
      max: [50, 'Cannot exceed 50 servings']
    },
    ingredients: {
      type: [ingredientSchema],
      required: [true, 'Ingredients are required'],
      validate: {
        validator: function(ingredients: IIngredient[]) {
          return ingredients.length >= 2 && ingredients.length <= 30;
        },
        message: 'Recipe must have between 2 and 30 ingredients'
      }
    },
    instructions: {
      type: [String],
      required: [true, 'Instructions are required'],
      validate: {
        validator: function(instructions: string[]) {
          return instructions.length >= 2 && instructions.length <= 20;
        },
        message: 'Recipe must have between 2 and 20 steps'
      }
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    ratingCount: {
      type: Number,
      default: 0,
      min: 0
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    chefNotes: {
      type: String,
      trim: true,
      maxlength: [300, 'Chef notes cannot exceed 300 characters'],
      default: ''
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

recipeSchema.index({ userId: 1, category: 1 });
recipeSchema.index({ difficulty: 1 });
recipeSchema.index({ rating: -1 });
recipeSchema.index({ isFeatured: 1 });
recipeSchema.index({ title: 'text', description: 'text' });

export default mongoose.model<IRecipe>('Recipe', recipeSchema);
