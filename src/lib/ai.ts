import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export type DishDraft = {
  name: string;
  category: string;
  originalDescription: string;
  dietary?: string[];
};

export async function generateDishVariants(dish: DishDraft) {
  const fallback = {
    concise: {
      type: 'concise',
      label: 'Concise & Impactful',
      description: `${dish.name} served with premium ingredients, balanced seasoning, and a refined finish designed to tempt guests at first glance.`,
      wordCount: 22,
      highlightWords: ['premium ingredients', 'refined finish', 'balanced seasoning'],
    },
    storytelling: {
      type: 'storytelling',
      label: 'Culinary Storytelling',
      description: `A signature plate of ${dish.name}, crafted with care and layered with vibrant flavors, warm textures, and a classic culinary finish that brings the dish to life.`,
      wordCount: 28,
      highlightWords: ['signature plate', 'vibrant flavors', 'classic culinary finish'],
    },
    ingredientFocused: {
      type: 'ingredient-focused',
      label: 'Ingredient-Focused',
      description: `Carefully composed with premium ingredients, seasonal accents, and a thoughtful blend of flavor, texture, and balance in every bite.`,
      wordCount: 21,
      highlightWords: ['premium ingredients', 'seasonal accents', 'thoughtful blend'],
    },
  };

  if (!openai) return fallback;

  try {
    const prompt = `You are a restaurant menu copywriter. Produce exactly 3 menu description variants in JSON with keys concise, storytelling, and ingredientFocused. Each value has type, label, description, wordCount, highlightWords. Keep the tone premium and appetizing. Dish: ${dish.name}. Category: ${dish.category}. Original description: ${dish.originalDescription}. Dietary tags: ${dish.dietary?.join(', ') || 'none'}.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return fallback;

    const parsed = JSON.parse(content) as Partial<typeof fallback>;
    if (!parsed.concise || !parsed.storytelling || !parsed.ingredientFocused) return fallback;

    return {
      concise: {
        type: 'concise',
        label: parsed.concise.label || 'Concise & Impactful',
        description: parsed.concise.description || fallback.concise.description,
        wordCount: parsed.concise.wordCount || fallback.concise.wordCount,
        highlightWords: parsed.concise.highlightWords || fallback.concise.highlightWords,
      },
      storytelling: {
        type: 'storytelling',
        label: parsed.storytelling.label || 'Culinary Storytelling',
        description: parsed.storytelling.description || fallback.storytelling.description,
        wordCount: parsed.storytelling.wordCount || fallback.storytelling.wordCount,
        highlightWords: parsed.storytelling.highlightWords || fallback.storytelling.highlightWords,
      },
      ingredientFocused: {
        type: 'ingredient-focused',
        label: parsed.ingredientFocused.label || 'Ingredient-Focused',
        description: parsed.ingredientFocused.description || fallback.ingredientFocused.description,
        wordCount: parsed.ingredientFocused.wordCount || fallback.ingredientFocused.wordCount,
        highlightWords: parsed.ingredientFocused.highlightWords || fallback.ingredientFocused.highlightWords,
      },
    };
  } catch (error) {
    console.error('AI generation failed:', error);
    return fallback;
  }
}
