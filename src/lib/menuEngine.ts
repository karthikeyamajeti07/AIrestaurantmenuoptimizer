export type PricingSuggestion = {
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
};

export function buildPricingSuggestions(dishes: any[]) {
  if (!dishes.length) return [];

  const averagePrice = dishes.reduce((sum, dish) => sum + Number(dish.price || 0), 0) / dishes.length;
  const highMargin = dishes.filter((dish) => Number(dish.margin || 0) >= 45);
  const bestsellers = dishes.filter((dish) => dish.isBestseller);

  return dishes.map((dish, index) => {
    const current = Number(dish.price || 0);
    const base = Math.max(current * 1.08, current + 25);
    const suggested = Math.round(base);
    const pairedWith = bestsellers.find((item) => item.id !== dish.id)?.name || 'Chef Signature Beverage';

    const bundlePrice = Math.round(current + (bestsellers[0]?.price || 180) * 0.7);

    return {
      dishId: dish.id,
      dishName: dish.name,
      currentPrice: current,
      suggestedPrice: suggested,
      strategy: index % 2 === 0 ? 'Price Anchor' : 'Margin Optimization',
      opportunityType: index % 3 === 0 ? 'bundle' : 'increase',
      reasoning: `${dish.name} has a strong premium positioning opportunity. A modest price revision aligns with the market and improves perceived value without reducing conversion.`,
      impactScore: highMargin.some((item) => item.id === dish.id) ? 'High' : 'Medium',
      bundleDetails: {
        pairedWith,
        bundlePrice,
        discountNotice: 'Bundle pricing creates a better-value experience and raises average check size.',
      },
    } satisfies PricingSuggestion;
  });
}

export function buildInsights(dishes: any[]) {
  return [
    {
      id: 'insight-stars',
      category: 'stars',
      title: 'Protect & Spotlight Bestsellers',
      subtitle: 'Unlock menu strength and perceived value',
      impact: '+18% revenue potential',
      recommendation: 'Give bestsellers prime placement and stronger descriptions to protect your highest-margin items.',
      affectedDishes: dishes.filter((dish) => dish.isBestseller).map((dish) => dish.name),
      actionLabel: 'Pin to Prime Visual Zone',
      status: 'pending',
    },
    {
      id: 'insight-bundles',
      category: 'bundles',
      title: 'Create Bundle Hooks',
      subtitle: 'Pair high-margin with best-volume dishes',
      impact: '+12% average check lift',
      recommendation: 'Bundle premium or high-margin items with top sellers to increase order value without heavy discounting.',
      affectedDishes: dishes.slice(0, 2).map((dish) => dish.name),
      actionLabel: 'Activate Combo Strategy',
      status: 'pending',
    },
  ];
}
