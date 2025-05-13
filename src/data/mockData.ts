
import { Restaurant, Category, MenuItem, Deal } from '../types';

export const mockRestaurant: Restaurant = {
  id: '1',
  name: 'Savory Bites',
  address: '123 Gourmet Street, Foodville, CA 94123',
  contactEmail: 'contact@savorybites.com',
  contactPhone: '(555) 123-4567',
  logoUrl: 'https://source.unsplash.com/random/200x200/?restaurant-logo'
};

export const mockCategories: Category[] = [
  { id: '1', restaurantId: '1', name: 'Appetizers', position: 1 },
  { id: '2', restaurantId: '1', name: 'Main Course', position: 2 },
  { id: '3', restaurantId: '1', name: 'Desserts', position: 3 },
  { id: '4', restaurantId: '1', name: 'Beverages', position: 4 }
];

export const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    restaurantId: '1',
    categoryId: '1',
    name: 'Garlic Bread',
    description: 'Freshly baked bread with garlic butter and herbs',
    ingredients: ['Bread', 'Butter', 'Garlic', 'Herbs'],
    price: 5.99,
    type: 'veg',
    tags: ['popular', 'vegetarian'],
    imageUrl: 'https://source.unsplash.com/random/300x200/?garlic-bread',
    available: true,
    position: 1
  },
  {
    id: '2',
    restaurantId: '1',
    categoryId: '1',
    name: 'Buffalo Wings',
    description: 'Spicy chicken wings with blue cheese dip',
    ingredients: ['Chicken wings', 'Hot sauce', 'Butter', 'Blue cheese'],
    price: 9.99,
    type: 'non-veg',
    tags: ['spicy', 'popular'],
    imageUrl: 'https://source.unsplash.com/random/300x200/?buffalo-wings',
    available: true,
    position: 2
  },
  {
    id: '3',
    restaurantId: '1',
    categoryId: '2',
    name: 'Classic Burger',
    description: 'Juicy beef patty with lettuce, tomato, and special sauce',
    ingredients: ['Beef', 'Lettuce', 'Tomato', 'Onion', 'Special sauce'],
    price: 12.99,
    type: 'non-veg',
    tags: ['popular'],
    imageUrl: 'https://source.unsplash.com/random/300x200/?burger',
    available: true,
    position: 1
  },
  {
    id: '4',
    restaurantId: '1',
    categoryId: '2',
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    ingredients: ['Pizza dough', 'Tomato sauce', 'Mozzarella', 'Basil'],
    price: 14.99,
    type: 'veg',
    tags: ['vegetarian', 'popular'],
    imageUrl: 'https://source.unsplash.com/random/300x200/?pizza',
    available: true,
    position: 2
  },
  {
    id: '5',
    restaurantId: '1',
    categoryId: '2',
    name: 'Pad Thai',
    description: 'Classic Thai dish with rice noodles, eggs, tofu, and peanuts',
    ingredients: ['Rice noodles', 'Eggs', 'Tofu', 'Peanuts', 'Bean sprouts'],
    price: 13.99,
    type: 'non-veg',
    tags: ['spicy', 'gluten-free'],
    imageUrl: 'https://source.unsplash.com/random/300x200/?pad-thai',
    available: true,
    position: 3
  },
  {
    id: '6',
    restaurantId: '1',
    categoryId: '3',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten chocolate center',
    ingredients: ['Chocolate', 'Flour', 'Eggs', 'Butter', 'Sugar'],
    price: 7.99,
    type: 'veg',
    tags: ['vegetarian'],
    imageUrl: 'https://source.unsplash.com/random/300x200/?chocolate-cake',
    available: true,
    position: 1
  },
  {
    id: '7',
    restaurantId: '1',
    categoryId: '4',
    name: 'Fresh Lemonade',
    description: 'Refreshing homemade lemonade with mint',
    ingredients: ['Lemon', 'Sugar', 'Water', 'Mint'],
    price: 3.99,
    type: 'veg',
    tags: ['vegetarian', 'refreshing'],
    imageUrl: 'https://source.unsplash.com/random/300x200/?lemonade',
    available: true,
    position: 1
  }
];

export const mockDeals: Deal[] = [
  {
    id: '1',
    restaurantId: '1',
    name: 'Family Feast',
    description: 'Perfect meal for 4: Includes 2 main courses, 2 sides, and 4 beverages',
    validFrom: new Date('2023-01-01'),
    validTo: new Date('2025-12-31'),
    discountType: 'percentage',
    discountValue: 15,
    items: [mockMenuItems[2], mockMenuItems[3], mockMenuItems[6]]
  },
  {
    id: '2',
    restaurantId: '1',
    name: 'Lunch Special',
    description: 'Enjoy a main course with a side and beverage at a special price',
    validFrom: new Date('2023-01-01'),
    validTo: new Date('2025-12-31'),
    discountType: 'flat',
    discountValue: 5,
    items: [mockMenuItems[4], mockMenuItems[6]]
  }
];

export const mockFavorites: string[] = [mockMenuItems[0].id!, mockMenuItems[3].id!];
