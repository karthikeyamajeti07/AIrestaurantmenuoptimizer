const express = require('express');
const cors = require('cors');
const { INITIAL_MENU, PRICING_RECOMMENDATIONS, MENU_STRATEGY_INSIGHTS } = require('./src/data/mockMenuData.ts');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

let currentMenu = JSON.parse(JSON.stringify(INITIAL_MENU));
let pricing = JSON.parse(JSON.stringify(PRICING_RECOMMENDATIONS));
let insights = JSON.parse(JSON.stringify(MENU_STRATEGY_INSIGHTS));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'menu-optimizer-api', timestamp: new Date().toISOString() });
});

app.get('/api/menu', (req, res) => {
  res.json({ menu: JSON.parse(JSON.stringify(currentMenu)) });
});

app.post('/api/menu/process', (req, res) => {
  const { fileName } = req.body || {};
  currentMenu = {
    ...JSON.parse(JSON.stringify(INITIAL_MENU)),
    metadata: {
      ...JSON.parse(JSON.stringify(INITIAL_MENU)).metadata,
      extractedFrom: fileName || 'uploaded-menu.pdf',
    },
  };

  res.json({ menu: JSON.parse(JSON.stringify(currentMenu)) });
});

app.put('/api/dish/:dishId', (req, res) => {
  const { dishId } = req.params;
  const updatedDish = req.body;
  const index = currentMenu.dishes.findIndex((dish) => dish.id === dishId);

  if (index === -1) {
    return res.status(404).json({ error: 'Dish not found' });
  }

  currentMenu.dishes[index] = { ...updatedDish };
  res.json({ dish: JSON.parse(JSON.stringify(currentMenu.dishes[index])) });
});

app.post('/api/dish/:dishId/description', (req, res) => {
  const { dishId } = req.params;
  const { variantType } = req.body;
  const dish = currentMenu.dishes.find((d) => d.id === dishId);

  if (!dish) {
    return res.status(404).json({ error: 'Dish not found' });
  }

  const variantMap = {
    concise: dish.descriptions.concise.description,
    storytelling: dish.descriptions.storytelling.description,
    'ingredient-focused': dish.descriptions.ingredientFocused.description,
  };

  dish.optimizedDescription = variantMap[variantType] || dish.originalDescription;
  dish.selectedDescriptionType = variantType;
  res.json({ dish: JSON.parse(JSON.stringify(dish)) });
});

app.post('/api/dish/:dishId/description/regenerate', (req, res) => {
  const { dishId } = req.params;
  const { variantType } = req.body;
  const dish = currentMenu.dishes.find((d) => d.id === dishId);

  if (!dish) {
    return res.status(404).json({ error: 'Dish not found' });
  }

  const variantMap = {
    concise: dish.descriptions.concise.description,
    storytelling: dish.descriptions.storytelling.description,
    'ingredient-focused': dish.descriptions.ingredientFocused.description,
  };

  const source = variantMap[variantType] || dish.originalDescription;
  const regenerated = `${source.split('.')[0]}. Refined with a premium, restaurant-ready finish tailored for higher guest appeal.`;
  res.json({ newDescription: regenerated });
});

app.get('/api/pricing', (req, res) => {
  res.json({ opportunities: JSON.parse(JSON.stringify(pricing)) });
});

app.post('/api/dish/:dishId/pricing', (req, res) => {
  const { dishId } = req.params;
  const { suggestedPrice } = req.body;
  const dish = currentMenu.dishes.find((d) => d.id === dishId);

  if (!dish) {
    return res.status(404).json({ error: 'Dish not found' });
  }

  dish.price = Number(suggestedPrice);
  dish.margin = Math.round(((Number(suggestedPrice) - dish.cost) / Number(suggestedPrice)) * 100);
  res.json({ ok: true });
});

app.get('/api/insights', (req, res) => {
  res.json({ insights: JSON.parse(JSON.stringify(insights)) });
});

app.post('/api/insights/:insightId/apply', (req, res) => {
  const { insightId } = req.params;
  const insight = insights.find((item) => item.id === insightId);

  if (!insight) {
    return res.status(404).json({ error: 'Insight not found' });
  }

  insight.status = 'applied';
  res.json({ ok: true, insight });
});

app.post('/api/menu/reset', (req, res) => {
  currentMenu = JSON.parse(JSON.stringify(INITIAL_MENU));
  pricing = JSON.parse(JSON.stringify(PRICING_RECOMMENDATIONS));
  insights = JSON.parse(JSON.stringify(MENU_STRATEGY_INSIGHTS));
  res.json({ menu: JSON.parse(JSON.stringify(currentMenu)) });
});

app.listen(PORT, () => {
  console.log(`MenuOptimizer API listening on http://localhost:${PORT}`);
});
