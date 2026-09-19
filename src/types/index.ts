export type ScreenId =
  | 'dashboard'
  | 'upload'
  | 'processing'
  | 'overview'
  | 'descriptions'
  | 'pricing'
  | 'strategy'
  | 'studio';

export type DietaryTag = 'Vegetarian' | 'Vegan' | 'Gluten-Free' | 'Contains Nuts' | 'Spicy' | 'Chef Special';

export type MenuCategoryType = 'Antipasti' | 'Wood-Fired Pizza' | 'Handmade Pasta' | 'Secondi' | 'Dolci' | 'Beverages';

export interface AIDescriptionVariant {
  type: 'concise' | 'storytelling' | 'ingredient-focused';
  label: string;
  description: string;
  wordCount: number;
  highlightWords: string[];
}

export interface Dish {
  id: string;
  name: string;
  category: MenuCategoryType;
  price: number; // in INR ₹
  cost: number; // food cost
  margin: number; // percentage e.g. 40
  isBestseller: boolean;
  dietary: DietaryTag[];
  originalDescription: string;
  optimizedDescription?: string;
  selectedDescriptionType?: 'original' | 'concise' | 'storytelling' | 'ingredient-focused';
  descriptions: {
    concise: AIDescriptionVariant;
    storytelling: AIDescriptionVariant;
    ingredientFocused: AIDescriptionVariant;
  };
  matrixQuadrant?: 'Star' | 'Plowhorse' | 'Puzzle' | 'Dog';
  orderFrequency: number; // monthly order count estimate
}

export interface Category {
  id: string;
  name: MenuCategoryType;
  description?: string;
  itemCount: number;
}

export interface Menu {
  id: string;
  restaurantName: string;
  tagline: string;
  currencySymbol: string;
  currencyCode: string;
  lastUpdated: string;
  categories: Category[];
  dishes: Dish[];
  metadata: {
    extractedFrom: string;
    totalItems: number;
    averagePrice: number;
    lowestPrice: number;
    highestPrice: number;
    averageMargin: number;
    bestsellerCount: number;
    potentialRevenueLift: number; // estimated %
  };
}

export interface PricingOpportunity {
  dishId: string;
  dishName: string;
  currentPrice: number;
  suggestedPrice: number;
  strategy: 'Price Anchor' | 'Margin Optimization' | 'Decoy Effect' | 'Premium Charm' | 'Bundle Opportunity';
  opportunityType: 'increase' | 'bundle' | 'anchor';
  reasoning: string;
  impactScore: 'High' | 'Medium' | 'Low';
  bundleDetails?: {
    pairedWith: string;
    bundlePrice: number;
    discountNotice: string;
  };
}

export interface MenuStrategyInsight {
  id: string;
  category: 'stars' | 'slow-movers' | 'promotions' | 'bundles' | 'visibility';
  title: string;
  subtitle: string;
  impact: string;
  recommendation: string;
  affectedDishes: string[];
  actionLabel: string;
  status?: 'pending' | 'applied';
}

export interface MenuEngineeringStats {
  stars: Dish[]; // High margin, high popularity
  plowhorses: Dish[]; // Low margin, high popularity
  puzzles: Dish[]; // High margin, low popularity
  dogs: Dish[]; // Low margin, low popularity
}

export interface ProcessingStep {
  id: string;
  label: string;
  detail: string;
  durationMs: number;
}
