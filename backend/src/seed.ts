import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User';
import Recipe from './models/Recipe';
import { connectDB } from './config/database';

dotenv.config();

const sampleRecipes = [
  {
    title: 'Classic Chocolate Chip Cookies',
    description: 'Soft and chewy chocolate chip cookies that melt in your mouth. Perfect for any occasion!',
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800',
    difficulty: 'easy',
    category: 'dessert',
    prepTime: 15,
    cookTime: 12,
    servings: 24,
    ingredients: [
      { name: 'All-purpose flour', quantity: '2 1/4', unit: 'cups' },
      { name: 'Butter', quantity: '1', unit: 'cup' },
      { name: 'Brown sugar', quantity: '3/4', unit: 'cup' },
      { name: 'White sugar', quantity: '3/4', unit: 'cup' },
      { name: 'Eggs', quantity: '2', unit: 'large' },
      { name: 'Vanilla extract', quantity: '2', unit: 'tsp' },
      { name: 'Baking soda', quantity: '1', unit: 'tsp' },
      { name: 'Salt', quantity: '1', unit: 'tsp' },
      { name: 'Chocolate chips', quantity: '2', unit: 'cups' }
    ],
    instructions: [
      'Preheat oven to 375°F (190°C)',
      'Cream together butter and both sugars until fluffy',
      'Beat in eggs one at a time, then stir in vanilla',
      'In separate bowl, combine flour, baking soda, and salt',
      'Gradually blend dry ingredients into butter mixture',
      'Fold in chocolate chips',
      'Drop rounded tablespoons of dough onto ungreased cookie sheets',
      'Bake for 9-11 minutes or until golden brown',
      'Cool on baking sheet for 2 minutes before removing to wire rack'
    ],
    chefNotes: 'For extra chewy cookies, slightly underbake them. Store in airtight container for up to 5 days.',
    isFeatured: true
  },
  {
    title: 'Avocado Toast with Poached Egg',
    description: 'A healthy and delicious breakfast that takes only 10 minutes to prepare!',
    imageUrl: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800',
    difficulty: 'easy',
    category: 'breakfast',
    prepTime: 5,
    cookTime: 5,
    servings: 2,
    ingredients: [
      { name: 'Whole grain bread', quantity: '2', unit: 'slices' },
      { name: 'Ripe avocado', quantity: '1', unit: 'large' },
      { name: 'Eggs', quantity: '2', unit: 'large' },
      { name: 'Lemon juice', quantity: '1', unit: 'tbsp' },
      { name: 'Salt', quantity: '1/4', unit: 'tsp' },
      { name: 'Black pepper', quantity: '1/4', unit: 'tsp' },
      { name: 'Red pepper flakes', quantity: '1/4', unit: 'tsp' }
    ],
    instructions: [
      'Toast bread slices until golden brown',
      'Bring a pot of water to gentle simmer for poaching eggs',
      'Mash avocado in a bowl with lemon juice, salt, and pepper',
      'Crack eggs into simmering water and poach for 3-4 minutes',
      'Spread avocado mixture on toasted bread',
      'Top each toast with a poached egg',
      'Sprinkle with red pepper flakes and additional salt if desired'
    ],
    chefNotes: 'Add cherry tomatoes or microgreens for extra nutrition and color!',
    isFeatured: true
  },
  {
    title: 'Spaghetti Carbonara',
    description: 'Authentic Italian pasta dish with crispy pancetta, eggs, and parmesan cheese.',
    imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800',
    difficulty: 'medium',
    category: 'dinner',
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    ingredients: [
      { name: 'Spaghetti', quantity: '400', unit: 'g' },
      { name: 'Pancetta or bacon', quantity: '200', unit: 'g' },
      { name: 'Eggs', quantity: '4', unit: 'large' },
      { name: 'Parmesan cheese', quantity: '1', unit: 'cup' },
      { name: 'Black pepper', quantity: '1', unit: 'tsp' },
      { name: 'Salt', quantity: '1', unit: 'tsp' },
      { name: 'Garlic cloves', quantity: '2', unit: 'cloves' }
    ],
    instructions: [
      'Bring large pot of salted water to boil and cook spaghetti until al dente',
      'While pasta cooks, cut pancetta into small pieces',
      'Fry pancetta in a large pan until crispy',
      'In a bowl, whisk together eggs, parmesan, and black pepper',
      'Reserve 1 cup of pasta water before draining',
      'Add hot drained pasta to the pan with pancetta',
      'Remove from heat and quickly mix in egg mixture',
      'Add pasta water little by little to create creamy sauce',
      'Serve immediately with extra parmesan and black pepper'
    ],
    chefNotes: 'The key is to mix the eggs off the heat to avoid scrambling. Work quickly!',
    isFeatured: true
  },
  {
    title: 'Greek Salad',
    description: 'Fresh and vibrant Mediterranean salad with feta cheese and olives.',
    imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800',
    difficulty: 'easy',
    category: 'lunch',
    prepTime: 15,
    cookTime: 1,
    servings: 4,
    ingredients: [
      { name: 'Cucumbers', quantity: '2', unit: 'large' },
      { name: 'Cherry tomatoes', quantity: '2', unit: 'cups' },
      { name: 'Red onion', quantity: '1', unit: 'medium' },
      { name: 'Bell pepper', quantity: '1', unit: 'large' },
      { name: 'Feta cheese', quantity: '200', unit: 'g' },
      { name: 'Kalamata olives', quantity: '1', unit: 'cup' },
      { name: 'Olive oil', quantity: '1/4', unit: 'cup' },
      { name: 'Lemon juice', quantity: '2', unit: 'tbsp' },
      { name: 'Dried oregano', quantity: '1', unit: 'tsp' }
    ],
    instructions: [
      'Chop cucumbers, tomatoes, and bell pepper into bite-sized pieces',
      'Slice red onion thinly',
      'Combine all vegetables in a large bowl',
      'Add olives and crumbled feta cheese',
      'In a small bowl, whisk together olive oil, lemon juice, and oregano',
      'Pour dressing over salad and toss gently',
      'Let sit for 5 minutes before serving to allow flavors to meld'
    ],
    chefNotes: 'Best served fresh! Add grilled chicken for a complete meal.',
    isFeatured: false
  },
  {
    title: 'Beef Wellington',
    description: 'Luxurious beef tenderloin wrapped in mushroom duxelles and puff pastry. Perfect for special occasions!',
    imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800',
    difficulty: 'expert',
    category: 'dinner',
    prepTime: 60,
    cookTime: 45,
    servings: 6,
    ingredients: [
      { name: 'Beef tenderloin', quantity: '1.5', unit: 'kg' },
      { name: 'Mushrooms', quantity: '500', unit: 'g' },
      { name: 'Puff pastry', quantity: '500', unit: 'g' },
      { name: 'Pâté or liver mousse', quantity: '150', unit: 'g' },
      { name: 'Prosciutto', quantity: '12', unit: 'slices' },
      { name: 'Egg yolk', quantity: '1', unit: 'large' },
      { name: 'Shallots', quantity: '2', unit: 'medium' },
      { name: 'Garlic', quantity: '3', unit: 'cloves' },
      { name: 'Fresh thyme', quantity: '2', unit: 'tbsp' },
      { name: 'Olive oil', quantity: '2', unit: 'tbsp' }
    ],
    instructions: [
      'Sear beef tenderloin in hot pan until browned on all sides, let cool',
      'Finely chop mushrooms, shallots, and garlic',
      'Cook mushroom mixture until all liquid evaporates (duxelles)',
      'Season with thyme, salt, and pepper, let cool completely',
      'Lay plastic wrap on counter, arrange prosciutto slices overlapping',
      'Spread pâté over prosciutto, then mushroom duxelles',
      'Place beef in center and roll tightly using plastic wrap',
      'Refrigerate for at least 30 minutes',
      'Roll out puff pastry, unwrap beef and place in center',
      'Wrap pastry around beef, seal edges with egg wash',
      'Brush entire surface with egg wash, score decoratively',
      'Bake at 200°C (400°F) for 25-30 minutes until golden',
      'Rest for 10 minutes before slicing'
    ],
    chefNotes: 'Use a meat thermometer: 50°C for rare, 55°C for medium-rare. This is a showstopper!',
    isFeatured: true
  },
  {
    title: 'Mango Smoothie Bowl',
    description: 'Tropical and refreshing smoothie bowl topped with fresh fruits and granola.',
    imageUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800',
    difficulty: 'easy',
    category: 'breakfast',
    prepTime: 10,
    cookTime: 1,
    servings: 2,
    ingredients: [
      { name: 'Frozen mango chunks', quantity: '2', unit: 'cups' },
      { name: 'Banana', quantity: '1', unit: 'large' },
      { name: 'Greek yogurt', quantity: '1/2', unit: 'cup' },
      { name: 'Coconut milk', quantity: '1/2', unit: 'cup' },
      { name: 'Honey', quantity: '1', unit: 'tbsp' },
      { name: 'Fresh berries', quantity: '1/2', unit: 'cup' },
      { name: 'Granola', quantity: '1/4', unit: 'cup' },
      { name: 'Coconut flakes', quantity: '2', unit: 'tbsp' }
    ],
    instructions: [
      'Add frozen mango, banana, yogurt, and coconut milk to blender',
      'Blend until smooth and thick',
      'Pour into two bowls',
      'Top with fresh berries, granola, and coconut flakes',
      'Drizzle with honey',
      'Serve immediately'
    ],
    chefNotes: 'Add chia seeds or protein powder for extra nutrition!',
    isFeatured: false
  },
  {
    title: 'Chicken Tikka Masala',
    description: 'Creamy and flavorful Indian curry with tender chicken pieces in spiced tomato sauce.',
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
    difficulty: 'medium',
    category: 'dinner',
    prepTime: 30,
    cookTime: 40,
    servings: 6,
    ingredients: [
      { name: 'Chicken breast', quantity: '800', unit: 'g' },
      { name: 'Greek yogurt', quantity: '1', unit: 'cup' },
      { name: 'Heavy cream', quantity: '1', unit: 'cup' },
      { name: 'Tomato sauce', quantity: '400', unit: 'g' },
      { name: 'Onion', quantity: '2', unit: 'large' },
      { name: 'Garlic', quantity: '4', unit: 'cloves' },
      { name: 'Ginger', quantity: '2', unit: 'tbsp' },
      { name: 'Garam masala', quantity: '2', unit: 'tbsp' },
      { name: 'Cumin', quantity: '1', unit: 'tsp' },
      { name: 'Paprika', quantity: '2', unit: 'tsp' }
    ],
    instructions: [
      'Marinate chicken pieces in yogurt, half the spices, and salt for 30 minutes',
      'Grill or pan-fry chicken until cooked through, set aside',
      'Sauté diced onion until golden',
      'Add minced garlic and ginger, cook for 1 minute',
      'Add remaining spices and cook until fragrant',
      'Pour in tomato sauce and simmer for 10 minutes',
      'Stir in cream and cooked chicken',
      'Simmer for 15 minutes until sauce thickens',
      'Garnish with cilantro and serve with rice or naan'
    ],
    chefNotes: 'Make it ahead - tastes even better the next day! Adjust spice level to taste.',
    isFeatured: false
  },
  {
    title: 'New York Cheesecake',
    description: 'Rich and creamy classic cheesecake with graham cracker crust.',
    imageUrl: 'https://images.unsplash.com/photo-1533134242116-bc5a31163ff8?w=800',
    difficulty: 'hard',
    category: 'dessert',
    prepTime: 30,
    cookTime: 90,
    servings: 12,
    ingredients: [
      { name: 'Cream cheese', quantity: '900', unit: 'g' },
      { name: 'Sugar', quantity: '1 1/2', unit: 'cups' },
      { name: 'Sour cream', quantity: '1', unit: 'cup' },
      { name: 'Eggs', quantity: '5', unit: 'large' },
      { name: 'Vanilla extract', quantity: '2', unit: 'tsp' },
      { name: 'Graham crackers', quantity: '2', unit: 'cups' },
      { name: 'Butter', quantity: '1/2', unit: 'cup' },
      { name: 'Lemon juice', quantity: '1', unit: 'tbsp' }
    ],
    instructions: [
      'Preheat oven to 325°F (160°C)',
      'Mix crushed graham crackers with melted butter',
      'Press into bottom of 9-inch springform pan',
      'Beat cream cheese until smooth',
      'Add sugar and beat until fluffy',
      'Beat in eggs one at a time',
      'Mix in sour cream, vanilla, and lemon juice',
      'Pour batter over crust',
      'Bake for 60-70 minutes until edges are set but center jiggles',
      'Turn off oven and leave cheesecake inside for 1 hour',
      'Refrigerate for at least 4 hours before serving'
    ],
    chefNotes: 'Water bath prevents cracks! Cool slowly to avoid splitting. Best made a day ahead.',
    isFeatured: true
  },
  {
    title: 'Homemade Guacamole',
    description: 'Fresh and zesty guacamole perfect for dipping tortilla chips or topping tacos.',
    imageUrl: 'https://images.unsplash.com/photo-1623961993815-ad2a84b51d4a?w=800',
    difficulty: 'easy',
    category: 'snack',
    prepTime: 10,
    cookTime: 1,
    servings: 6,
    ingredients: [
      { name: 'Ripe avocados', quantity: '4', unit: 'large' },
      { name: 'Lime juice', quantity: '2', unit: 'tbsp' },
      { name: 'Red onion', quantity: '1/4', unit: 'cup' },
      { name: 'Tomato', quantity: '1', unit: 'medium' },
      { name: 'Fresh cilantro', quantity: '2', unit: 'tbsp' },
      { name: 'Jalapeño', quantity: '1', unit: 'small' },
      { name: 'Salt', quantity: '1/2', unit: 'tsp' },
      { name: 'Garlic', quantity: '1', unit: 'clove' }
    ],
    instructions: [
      'Halve avocados and remove pits',
      'Scoop flesh into a bowl',
      'Mash with fork to desired consistency',
      'Finely dice onion, tomato, jalapeño, and garlic',
      'Chop cilantro',
      'Add all ingredients to mashed avocado',
      'Mix well and add lime juice',
      'Season with salt to taste',
      'Serve immediately with tortilla chips'
    ],
    chefNotes: 'Keep the avocado pit in the guacamole to prevent browning. Adjust jalapeño for heat level!',
    isFeatured: false
  },
  {
    title: 'Iced Caramel Macchiato',
    description: 'Refreshing coffee drink with vanilla, milk, espresso, and caramel drizzle.',
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800',
    difficulty: 'easy',
    category: 'beverage',
    prepTime: 5,
    cookTime: 2,
    servings: 1,
    ingredients: [
      { name: 'Espresso', quantity: '2', unit: 'shots' },
      { name: 'Milk', quantity: '1', unit: 'cup' },
      { name: 'Vanilla syrup', quantity: '1', unit: 'tbsp' },
      { name: 'Caramel sauce', quantity: '2', unit: 'tbsp' },
      { name: 'Ice cubes', quantity: '1', unit: 'cup' }
    ],
    instructions: [
      'Fill a tall glass with ice cubes',
      'Pour vanilla syrup over ice',
      'Add cold milk',
      'Brew 2 shots of espresso',
      'Pour hot espresso over the milk',
      'Drizzle caramel sauce on top',
      'Stir before drinking or enjoy layered'
    ],
    chefNotes: 'Use cold brew instead of espresso for a smoother taste. Add whipped cream for extra indulgence!',
    isFeatured: false
  }
];

async function seedDatabase() {
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Recipe.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users with plain passwords (will be hashed by pre-save hook)
    const adminUser = await User.create({
      name: 'Admin Chef',
      email: 'admin@recipebook.com',
      password: 'Admin123!@#',
      role: 'admin'
    });

    const regularUser = await User.create({
      name: 'Home Chef',
      email: 'user@recipebook.com',
      password: 'User123!@#',
      role: 'user'
    });

    console.log('✅ Created test users:');
    console.log('   👑 Admin: admin@recipebook.com / Admin123!@#');
    console.log('   🧑‍🍳 User: user@recipebook.com / User123!@#');

    // Create recipes (some for admin, some for user)
    const recipesToCreate = sampleRecipes.map((recipe, index) => {
      // Assign first 6 recipes to admin, rest to regular user
      const userId = index < 6 ? adminUser._id : regularUser._id;
      return {
        ...recipe,
        userId
      };
    });

    const createdRecipes = await Recipe.insertMany(recipesToCreate);
    console.log(`✅ Created ${createdRecipes.length} sample recipes`);

    // Show summary
    const adminRecipeCount = createdRecipes.filter(r => (r.userId as any).toString() === (adminUser._id as any).toString()).length;
    const userRecipeCount = createdRecipes.filter(r => (r.userId as any).toString() === (regularUser._id as any).toString()).length;
    const featuredCount = createdRecipes.filter(r => r.isFeatured).length;

    console.log('\n📊 Database Summary:');
    console.log(`   Total Users: 2`);
    console.log(`   Total Recipes: ${createdRecipes.length}`);
    console.log(`   Admin's Recipes: ${adminRecipeCount}`);
    console.log(`   User's Recipes: ${userRecipeCount}`);
    console.log(`   Featured Recipes: ${featuredCount}`);
    console.log('\n🎯 Categories:');
    
    const categories = createdRecipes.reduce((acc: any, recipe: any) => {
      acc[recipe.category] = (acc[recipe.category] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(categories).forEach(([category, count]) => {
      const emoji = {
        breakfast: '🍳',
        lunch: '🥗',
        dinner: '🍽️',
        dessert: '🍰',
        snack: '🍿',
        beverage: '☕'
      }[category] || '🍴';
      console.log(`   ${emoji} ${category}: ${count}`);
    });

    console.log('\n✨ Seed completed successfully!');
    console.log('🚀 Start the servers and login with the test accounts above.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
