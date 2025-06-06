

export interface Restaurant {
  id?: string;
  name: string;
  address: string;
  contactEmail: string;
  contactPhone?: string;
  logoUrl?: string;
  themeId?: string;
  themeSettings?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

export interface Theme {
  id?: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily?: string;
}

export interface Category {
  id?: string;
  restaurantId?: string;
  name: string;
  position: number;
  description?: string; // Added description field as optional
}

export interface MenuItem {
  id?: string;
  restaurantId?: string;
  categoryId: string;
  name: string;
  description: string;
  ingredients?: string[];
  price: number;
  type: 'veg' | 'non-veg';
  tags: string[];
  imageUrl?: string;
  available: boolean;
  position: number;
}

export interface Deal {
  id?: string;
  restaurantId?: string;
  name: string;
  description: string;
  validFrom: Date;
  validTo: Date;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  items?: MenuItem[];
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface FavoriteItem {
  userId?: string;
  menuItemId: string;
  menuItem?: MenuItem;
}

