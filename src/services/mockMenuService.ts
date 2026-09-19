import { Menu, Dish, PricingOpportunity, MenuStrategyInsight } from '../types';
import { INITIAL_MENU, PRICING_RECOMMENDATIONS, MENU_STRATEGY_INSIGHTS } from '../data/mockMenuData';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('menuoptimizer_token');
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    try {
      const parsed = JSON.parse(text) as { error?: string };
      throw new Error(parsed.error || `Request failed (${response.status})`);
    } catch (parseError) {
      if (parseError instanceof Error && parseError.message !== text) throw parseError;
      throw new Error(
        response.status === 404
          ? 'The API route is unavailable. Restart the current server with npm run dev.'
          : `Request failed (${response.status})`,
      );
    }
  }

  return (await response.json()) as T;
}

function fallbackMenu(): Menu {
  return JSON.parse(JSON.stringify(INITIAL_MENU));
}

function fallbackPricing(): PricingOpportunity[] {
  return JSON.parse(JSON.stringify(PRICING_RECOMMENDATIONS));
}

function fallbackInsights(): MenuStrategyInsight[] {
  return JSON.parse(JSON.stringify(MENU_STRATEGY_INSIGHTS));
}

export const menuService = {
  async authenticate(mode: 'login' | 'register', payload: { name?: string; email: string; password: string }) {
    const result = await request<{ token: string; user: { id: string; name?: string; email: string } }>(`/auth/${mode}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    localStorage.setItem('menuoptimizer_token', result.token);
    return result.user;
  },

  async analyzeUploadedMenu(file: File | null, restaurantName: string, text = ''): Promise<Menu> {
    const formData = new FormData();
    if (file) formData.append('file', file);
    formData.append('restaurantName', restaurantName);
    if (text.trim()) formData.append('text', text.trim());

    try {
      const response = await fetch(`${API_BASE}/menu/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const message = await response.text();
        try {
          const parsed = JSON.parse(message) as { error?: string };
          throw new Error(parsed.error || 'Menu analysis failed');
        } catch (parseError) {
          if (parseError instanceof Error && parseError.message !== message) throw parseError;
          throw new Error(message || 'Menu analysis failed');
        }
      }

      const result = (await response.json()) as { menu: Menu };
      return result.menu;
    } catch (error) {
      console.error('Uploaded menu analysis failed.', error);
      throw error;
    }
  },

  async getMenu(): Promise<Menu> {
    try {
      const result = await request<{ menu: Menu }>('/menu');
      return result.menu;
    } catch (error) {
      return fallbackMenu();
    }
  },

  async processMenu(fileName: string): Promise<Menu> {
    try {
      const result = await request<{ menu: Menu }>('/menu/process', {
        method: 'POST',
        body: JSON.stringify({ fileName }),
      });
      return result.menu;
    } catch (error) {
      return fallbackMenu();
    }
  },

  async updateDish(updatedDish: Dish): Promise<Dish> {
    try {
      const result = await request<{ dish: Dish }>(`/dish/${updatedDish.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedDish),
      });
      return result.dish;
    } catch (error) {
      return updatedDish;
    }
  },

  async applyDescriptionVariant(
    dishId: string,
    variantType: 'concise' | 'storytelling' | 'ingredient-focused'
  ): Promise<Dish> {
    try {
      const result = await request<{ dish: Dish }>(`/dish/${dishId}/description`, {
        method: 'POST',
        body: JSON.stringify({ variantType }),
      });
      return result.dish;
    } catch (error) {
      const menu = fallbackMenu();
      const dish = menu.dishes.find((d) => d.id === dishId);
      if (!dish) throw new Error('Dish not found');
      const nextDescription =
        variantType === 'concise'
          ? dish.descriptions.concise.description
          : variantType === 'storytelling'
            ? dish.descriptions.storytelling.description
            : dish.descriptions.ingredientFocused.description;
      dish.optimizedDescription = nextDescription;
      dish.selectedDescriptionType = variantType;
      return dish;
    }
  },

  async regenerateDescription(
    dishId: string,
    variantType: 'concise' | 'storytelling' | 'ingredient-focused'
  ): Promise<string> {
    try {
      const result = await request<{ newDescription: string }>(`/dish/${dishId}/description/regenerate`, {
        method: 'POST',
        body: JSON.stringify({ variantType }),
      });
      return result.newDescription;
    } catch (error) {
      const menu = fallbackMenu();
      const dish = menu.dishes.find((d) => d.id === dishId);
      if (!dish) throw new Error('Dish not found');
      const existing =
        variantType === 'concise'
          ? dish.descriptions.concise.description
          : variantType === 'storytelling'
            ? dish.descriptions.storytelling.description
            : dish.descriptions.ingredientFocused.description;
      return `${existing.split('.')[0]}. Gently finished with fresh market herbs and artisanal seasoning.`;
    }
  },

  async getPricingOpportunities(): Promise<PricingOpportunity[]> {
    try {
      const result = await request<{ opportunities: PricingOpportunity[] }>('/pricing');
      return result.opportunities;
    } catch (error) {
      return fallbackPricing();
    }
  },

  async applyPricingRecommendation(dishId: string, suggestedPrice: number): Promise<void> {
    try {
      await request(`/dish/${dishId}/pricing`, {
        method: 'POST',
        body: JSON.stringify({ suggestedPrice }),
      });
    } catch (error) {
      const menu = fallbackMenu();
      const dish = menu.dishes.find((d) => d.id === dishId);
      if (dish) {
        dish.price = suggestedPrice;
        dish.margin = Math.round(((suggestedPrice - dish.cost) / suggestedPrice) * 100);
      }
    }
  },

  async getStrategyInsights(): Promise<MenuStrategyInsight[]> {
    try {
      const result = await request<{ insights: MenuStrategyInsight[] }>('/insights');
      return result.insights;
    } catch (error) {
      return fallbackInsights();
    }
  },

  async applyStrategyInsight(insightId: string): Promise<void> {
    try {
      await request(`/insights/${insightId}/apply`, { method: 'POST' });
    } catch (error) {
      const insights = fallbackInsights();
      const insight = insights.find((s) => s.id === insightId);
      if (insight) insight.status = 'applied';
    }
  },

  async resetMenu(): Promise<Menu> {
    try {
      const result = await request<{ menu: Menu }>('/menu/reset', { method: 'POST' });
      return result.menu;
    } catch (error) {
      return fallbackMenu();
    }
  },

  async exportMenu(menuId: string): Promise<string> {
    const result = await request<{ fileUrl: string }>(`/menu/${menuId}/export-pdf`, {
      method: 'POST',
    });
    return result.fileUrl;
  },
};
