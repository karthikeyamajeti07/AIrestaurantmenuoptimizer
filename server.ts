import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import OpenAI from 'openai';
import { z } from 'zod';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { createCanvas } from '@napi-rs/canvas';
import { INITIAL_MENU, PRICING_RECOMMENDATIONS, MENU_STRATEGY_INSIGHTS } from './src/data/mockMenuData';
import { buildPricingSuggestions, buildInsights } from './src/lib/menuEngine';

const app = express();
const PORT = Number(process.env.PORT || 4000);
const JWT_SECRET = process.env.JWT_SECRET || 'menu-optimizer-dev-secret';
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.webp'];
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, allowedExtensions.includes(extension));
  },
});

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const users: Array<{ id: string; name: string; email: string; passwordHash: string }> = [
  {
    id: 'demo-owner',
    name: 'Demo Restaurant Owner',
    email: 'demo@menuoptimizer.local',
    passwordHash: bcrypt.hashSync('demo1234', 10),
  },
];
const restaurants: Array<{ id: string; name: string; slug: string; ownerId: string; menuIds: string[] }> = [];
const menus: Array<any> = [];

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use('/exports', express.static(path.join(process.cwd(), 'exports')));

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

function ensureExportsDir() {
  const dir = path.join(process.cwd(), 'exports');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function signToken(user: { id: string; email: string }) {
  return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

function authRequired(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    req.user = { id: decoded.userId, email: decoded.email };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function sanitizeMenuData(menu: any) {
  return JSON.parse(JSON.stringify(menu));
}

function normalizeCategory(value: unknown) {
  return String(value || 'General').replace(/\s+/g, ' ').trim() || 'General';
}

function parsePrice(value: string) {
  const match = value.match(/\d+(?:\.\d{1,2})?/);
  return match ? Number(match[0]) : 0;
}

function parseMenuText(rawText: string) {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const dishes: any[] = [];
  let currentCategory = 'General';

  for (const line of lines) {
    if (line.endsWith(':') || line.length < 3) {
      currentCategory = line.replace(/:$/, '').trim() || currentCategory;
      continue;
    }

    const currencyPriceMatch = line.match(/[-–—]?\s*(?:rs\.?|inr|₹|\$)\s*(\d+(?:\.\d{1,2})?)/i);
    const priceMatch = currencyPriceMatch || line.match(/[-–—]?\s*(\d+(?:\.\d{1,2})?)(?!\s*(?:°|c|ml|g|oz)\b)/i);
    if (!priceMatch) continue;

    const priceStart = line.indexOf(priceMatch[0]);
    const textBeforePrice = line.slice(0, priceStart);
    const sentenceStart = Math.max(textBeforePrice.lastIndexOf('.'), textBeforePrice.lastIndexOf(':')) + 1;
    const namePart = textBeforePrice
      .slice(sentenceStart)
      .replace(/[-–—]$/, '')
      .trim();
    const price = Number(priceMatch[1]);
    const description = line.slice(line.indexOf(priceMatch[0]) + priceMatch[0].length).replace(/^[\s-–—:]+/, '').trim();

    if (!namePart) continue;

    dishes.push({
      id: randomUUID(),
      name: namePart,
      category: currentCategory || 'General',
      price,
      cost: Math.max(25, Math.round(price * 0.55)),
      margin: 40,
      isBestseller: false,
      dietary: [],
      matrixQuadrant: 'Puzzle',
      orderFrequency: 120,
      originalDescription: description || `Classic ${namePart} prepared with fresh ingredients and balanced seasoning.`,
      optimizedDescription: '',
      selectedDescriptionType: 'storytelling',
      descriptions: {
        concise: {
          type: 'concise',
          label: 'Concise & Impactful',
          description: `${namePart} prepared with premium ingredients and a refined finish designed to stand out on the menu.`,
          wordCount: 18,
          highlightWords: ['premium ingredients', 'refined finish'],
        },
        storytelling: {
          type: 'storytelling',
          label: 'Culinary Storytelling',
          description: `A signature preparation of ${namePart}, layered with vibrant flavors, warm textures, and a carefully balanced finish that invites a second bite.`,
          wordCount: 26,
          highlightWords: ['signature preparation', 'vibrant flavors', 'balanced finish'],
        },
        ingredientFocused: {
          type: 'ingredient-focused',
          label: 'Ingredient-Focused',
          description: `Crafted with thoughtfully sourced ingredients, premium seasoning, and a layered flavor profile designed for the modern diner.`,
          wordCount: 20,
          highlightWords: ['thoughtfully sourced ingredients', 'premium seasoning'],
        },
      },
    });
  }

  return dishes;
}

async function extractTextFromPdf(filePath: string) {
  const data = fs.readFileSync(filePath);
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(data) });
  const pdf = await loadingTask.promise;
  const chunks: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const rows = new Map<number, string[]>();

    for (const item of content.items as any[]) {
      if (!('str' in item) || !item.str.trim()) continue;
      const y = Math.round(item.transform?.[5] || 0);
      const row = rows.get(y) || [];
      row.push(item.str.trim());
      rows.set(y, row);
    }

    const pageLines = [...rows.entries()]
      .sort(([firstY], [secondY]) => secondY - firstY)
      .map(([, words]) => words.join(' '));
    chunks.push(pageLines.join('\n'));
  }

  const extractedText = chunks.join('\n').trim();
  if (extractedText.length >= 20) return extractedText;

  const ocrChunks: string[] = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
    const context = canvas.getContext('2d');

    await page.render({
      canvasContext: context as any,
      canvas: canvas as any,
      viewport,
    }).promise;

    const result = await Tesseract.recognize(canvas.toBuffer('image/png'), 'eng');
    if (result.data.text.trim()) ocrChunks.push(result.data.text);
  }

  return ocrChunks.join('\n');
}

async function extractTextFromImage(filePath: string) {
  const result = await Tesseract.recognize(filePath, 'eng');
  return result.data.text || '';
}

async function generateVariantSet(dish: any) {
  if (!openai) {
    return dish.descriptions;
  }

  try {
    const prompt = `You are a premium restaurant menu copywriter and menu categorization agent. Return JSON object with keys category, concise, storytelling, ingredientFocused. Category must be a short, customer-facing food section name such as Antipasti, Soups & Salads, Wood-Fired Pizza, Handmade Pasta, Secondi, Dolci, or Beverages. Use the existing category as a clue, but correct it when the dish clearly belongs elsewhere. Each description variant has type, label, description, wordCount, highlightWords. Dish: ${dish.name}. Existing category: ${dish.category}. Original description: ${dish.originalDescription}. Aim for elegant, appetizing menu language for a high-end restaurant. Keep each description under 35 words.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.82,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return dish.descriptions;

    const parsed = JSON.parse(content);
    return {
      category: typeof parsed.category === 'string' && parsed.category.trim() ? parsed.category.trim() : dish.category,
      concise: {
        ...dish.descriptions.concise,
        ...parsed.concise,
      },
      storytelling: {
        ...dish.descriptions.storytelling,
        ...parsed.storytelling,
      },
      ingredientFocused: {
        ...dish.descriptions.ingredientFocused,
        ...parsed.ingredientFocused,
      },
    };
  } catch (error) {
    console.error('AI generation error:', error);
    return dish.descriptions;
  }
}

function buildMenuFromDishes(restaurantName: string, dishes: any[]) {
  const categoryLabels = new Map<string, string>();
  const normalizedDishes = dishes.map((dish) => {
    const category = normalizeCategory(dish.category);
    const categoryKey = category.toLocaleLowerCase();
    const canonicalCategory = categoryLabels.get(categoryKey) || category;
    categoryLabels.set(categoryKey, canonicalCategory);
    return { ...dish, category: canonicalCategory };
  });
  const priceValues = dishes.map((dish) => Number(dish.price || 0)).filter(Boolean);
  const averagePrice = Math.round(priceValues.reduce((sum, price) => sum + price, 0) / (priceValues.length || 1));
  const averageMargin = Math.round(dishes.reduce((sum, dish) => sum + Number(dish.margin || 40), 0) / (dishes.length || 1));

  return {
    id: randomUUID(),
    restaurantName,
    tagline: 'AI-powered menu optimization for stronger sales and pricing psychology',
    currencySymbol: '₹',
    currencyCode: 'INR',
    lastUpdated: new Date().toISOString().slice(0, 10),
    categories: Array.from(new Set(normalizedDishes.map((dish) => dish.category))).map((name, idx) => ({
      id: `cat-${idx + 1}`,
      name,
      itemCount: normalizedDishes.filter((dish) => dish.category === name).length,
    })),
    dishes: normalizedDishes.map((dish) => ({
      ...dish,
      optimizedDescription: dish.optimizedDescription || dish.originalDescription,
      selectedDescriptionType: dish.selectedDescriptionType || 'storytelling',
      margin: Number(dish.margin || 40),
    })),
    metadata: {
      extractedFrom: 'uploaded-menu',
      totalItems: dishes.length,
      averagePrice,
      lowestPrice: Math.min(...priceValues, 0),
      highestPrice: Math.max(...priceValues, 0),
      averageMargin,
      bestsellerCount: dishes.filter((dish) => dish.isBestseller).length,
      potentialRevenueLift: 18.4,
    },
  };
}

async function parseAndGenerateMenu(restaurantName: string, rawText: string) {
  const parsedDishes = parseMenuText(rawText);

  const finalizedDishes = await Promise.all(parsedDishes.map(async (dish) => {
    const generated = await generateVariantSet(dish);
    const variantTypes = {
      concise: generated.concise,
      storytelling: generated.storytelling,
      ingredientFocused: generated.ingredientFocused,
    };

    const optimizedDescription = variantTypes.storytelling.description;

    return {
      ...dish,
      category: generated.category || dish.category,
      optimizedDescription,
      selectedDescriptionType: 'storytelling',
      descriptions: variantTypes,
      isBestseller: dish.price > 300 && dish.margin >= 40,
      margin: Math.max(35, Math.min(65, Math.round((dish.price - dish.cost) / dish.price * 100))),
    };
  }));

  return buildMenuFromDishes(restaurantName, finalizedDishes);
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'menu-optimizer-api', timestamp: new Date().toISOString() });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const payload = userSchema.parse(req.body);
    const exists = users.some((user) => user.email.toLowerCase() === payload.email.toLowerCase());
    if (exists) return res.status(409).json({ error: 'User already exists' });

    const passwordHash = await bcrypt.hash(payload.password, 10);
    const newUser = { id: randomUUID(), name: payload.name, email: payload.email, passwordHash };
    users.push(newUser);

    const token = signToken({ id: newUser.id, email: newUser.email });
    res.json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid input' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const payload = loginSchema.parse(req.body);
    const user = users.find((entry) => entry.email.toLowerCase() === payload.email.toLowerCase());
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(payload.password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken({ id: user.id, email: user.email });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid input' });
  }
});

app.get('/api/restaurants', authRequired, (req, res) => {
  const ownerRestaurants = restaurants.filter((restaurant) => restaurant.ownerId === (req as any).user.id);
  res.json({ restaurants: ownerRestaurants });
});

app.post('/api/restaurants', authRequired, (req, res) => {
  const { name, cuisine, location } = req.body || {};
  const slug = `${(name || 'restaurant').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${randomUUID().slice(0, 6)}`;
  const restaurant = { id: randomUUID(), name: name || 'New Restaurant', slug, cuisine: cuisine || 'Contemporary', location: location || 'Local', ownerId: (req as any).user.id, menuIds: [] };
  restaurants.push(restaurant);
  res.status(201).json({ restaurant });
});

app.post('/api/menu/analyze', upload.single('file'), async (req, res) => {
  let temporaryFilePath: string | undefined;
  try {
    const restaurantName = String(req.body.restaurantName || 'DineWell');
    const rawText = String(req.body.text || '');

    let finalText = rawText;

    if (req.file) {
      const tempFile = req.file.path;
      temporaryFilePath = tempFile;
      const extension = path.extname(req.file.originalname).toLowerCase();

      if (extension === '.pdf') {
        finalText = await extractTextFromPdf(tempFile);
      } else if (['.png', '.jpg', '.jpeg', '.webp'].includes(extension)) {
        finalText = await extractTextFromImage(tempFile);
      } else {
        finalText = fs.readFileSync(tempFile, 'utf8');
      }

      fs.unlinkSync(tempFile);
      temporaryFilePath = undefined;
    }

    if (!finalText.trim()) {
      return res.status(400).json({ error: 'No menu text detected. Upload a PDF or image, or paste menu text.' });
    }

    const menu = await parseAndGenerateMenu(restaurantName, finalText);
    if (!menu.dishes.length) {
      return res.status(422).json({ error: 'No dishes with prices were detected. Use a clearer menu image or PDF.' });
    }
    const menuRecord = { ...menu, id: randomUUID(), sourceType: req.file ? 'upload' : 'text' };
    menus.push(menuRecord);
    res.json({ menu: sanitizeMenuData(menuRecord) });
  } catch (error) {
    console.error('Menu analyze failed:', error);
    if (temporaryFilePath && fs.existsSync(temporaryFilePath)) fs.unlinkSync(temporaryFilePath);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Menu analysis failed' });
  }
});

app.get('/api/menu/:id', (req, res) => {
  const menu = menus.find((entry) => entry.id === req.params.id);
  if (!menu) return res.status(404).json({ error: 'Menu not found' });
  res.json({ menu: sanitizeMenuData(menu) });
});

app.get('/api/menu', (_req, res) => {
  const fallback = sanitizeMenuData(INITIAL_MENU);
  res.json({ menu: menus.at(-1) || fallback });
});

app.post('/api/menu/process', (req, res) => {
  const { fileName, restaurantName = 'Bella Italia' } = req.body || {};
  const menu = sanitizeMenuData({
    ...INITIAL_MENU,
    restaurantName,
    metadata: {
      ...INITIAL_MENU.metadata,
      extractedFrom: fileName || 'uploaded-menu.pdf',
    },
  });
  menus.push(menu);
  res.json({ menu });
});

app.post('/api/dish/:dishId/description', (req, res) => {
  const { variantType } = req.body || {};
  const menu = menus.at(-1) || INITIAL_MENU;
  const dish = menu.dishes.find((entry: any) => entry.id === req.params.dishId);
  if (!dish) return res.status(404).json({ error: 'Dish not found' });
  if (!['concise', 'storytelling', 'ingredient-focused'].includes(variantType)) {
    return res.status(400).json({ error: 'Invalid description variant' });
  }

  const variantMap: Record<string, string> = {
    concise: dish.descriptions.concise.description,
    storytelling: dish.descriptions.storytelling.description,
    'ingredient-focused': dish.descriptions.ingredientFocused.description,
  };

  dish.optimizedDescription = variantMap[variantType] || dish.originalDescription;
  dish.selectedDescriptionType = variantType;
  res.json({ dish: sanitizeMenuData(dish) });
});

app.post('/api/dish/:dishId/description/regenerate', (req, res) => {
  const { variantType } = req.body || {};
  const menu = menus.at(-1) || INITIAL_MENU;
  const dish = menu.dishes.find((entry: any) => entry.id === req.params.dishId);
  if (!dish) return res.status(404).json({ error: 'Dish not found' });
  if (!['concise', 'storytelling', 'ingredient-focused'].includes(variantType)) {
    return res.status(400).json({ error: 'Invalid description variant' });
  }

  const variant = dish.descriptions[variantType === 'ingredient-focused' ? 'ingredientFocused' : variantType];
  const regenerated = `${variant.description.split('.')[0]}. Finished with premium market herbs and a restaurant-ready finish.`;
  res.json({ newDescription: regenerated });
});

app.get('/api/pricing', (_req, res) => {
  const menu = menus.at(-1) || INITIAL_MENU;
  const suggestions = buildPricingSuggestions(menu.dishes);
  res.json({ opportunities: suggestions });
});

app.post('/api/dish/:dishId/pricing', (req, res) => {
  const { suggestedPrice } = req.body || {};
  const menu = menus.at(-1) || INITIAL_MENU;
  const dish = menu.dishes.find((entry: any) => entry.id === req.params.dishId);
  if (!dish) return res.status(404).json({ error: 'Dish not found' });
  const nextPrice = Number(suggestedPrice);
  if (!Number.isFinite(nextPrice) || nextPrice <= 0) {
    return res.status(400).json({ error: 'Price must be a positive number' });
  }
  dish.price = nextPrice;
  dish.margin = Math.round(((Number(suggestedPrice) - (dish.cost || 0)) / Number(suggestedPrice || 1)) * 100);
  res.json({ ok: true });
});

app.get('/api/insights', (_req, res) => {
  const menu = menus.at(-1) || INITIAL_MENU;
  res.json({ insights: buildInsights(menu.dishes) });
});

app.post('/api/insights/:insightId/apply', (req, res) => {
  res.json({ ok: true, insightId: req.params.insightId });
});

app.post('/api/menu/reset', (_req, res) => {
  const menu = sanitizeMenuData(INITIAL_MENU);
  menus.length = 0;
  menus.push(menu);
  res.json({ menu });
});

app.post('/api/menu/:id/export-pdf', async (req, res) => {
  ensureExportsDir();
  const menu = menus.find((entry) => entry.id === req.params.id);
  if (!menu) return res.status(404).json({ error: 'Menu not found' });
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const fontDirectory = path.join(process.cwd(), 'node_modules', 'pdfjs-dist', 'standard_fonts');
  const font = await pdfDoc.embedFont(fs.readFileSync(path.join(fontDirectory, 'LiberationSans-Regular.ttf')));
  const fontBold = await pdfDoc.embedFont(fs.readFileSync(path.join(fontDirectory, 'LiberationSans-Bold.ttf')));
  const pageWidth = 595;
  const pageHeight = 842;
  const margin = 52;
  const contentWidth = pageWidth - margin * 2;
  const colors = {
    ink: rgb(0.12, 0.12, 0.13),
    muted: rgb(0.38, 0.36, 0.32),
    accent: rgb(0.53, 0.29, 0.17),
    rule: rgb(0.82, 0.79, 0.72),
  };

  const wrapText = (text: string, textFont: any, size: number, maxWidth = contentWidth) => {
    const words = String(text || '').split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let line = '';
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (textFont.widthOfTextAtSize(candidate, size) <= maxWidth) {
        line = candidate;
      } else if (line) {
        lines.push(line);
        line = word;
      } else {
        lines.push(word);
      }
    }
    if (line) lines.push(line);
    return lines;
  };

  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - 54;
  const drawHeader = () => {
    page.drawText('Trattoria • Cucina Tradizionale', { x: margin, y, size: 9, font, color: colors.muted });
    y -= 28;
    page.drawText(String(menu.restaurantName || 'Restaurant'), { x: margin, y, size: 27, font: fontBold, color: colors.ink });
    y -= 28;
    page.drawLine({ start: { x: margin, y }, end: { x: pageWidth - margin, y }, thickness: 1, color: colors.rule });
    y -= 24;
  };

  const addPage = () => {
    page = pdfDoc.addPage([pageWidth, pageHeight]);
    y = pageHeight - 54;
    drawHeader();
  };

  drawHeader();
  const getCategoryName = (dish: any) => normalizeCategory(dish.category);
  const categories = Array.from(new Set(menu.dishes.map(getCategoryName)));
  for (const category of categories) {
    if (y < 130) addPage();
    page.drawText(String(category).toUpperCase(), { x: margin, y, size: 11, font: fontBold, color: colors.accent });
    y -= 16;
    page.drawLine({ start: { x: margin, y }, end: { x: pageWidth - margin, y }, thickness: 0.6, color: colors.rule });
    y -= 15;

    for (const dish of menu.dishes.filter((entry: any) => getCategoryName(entry) === category)) {
      const description = dish.optimizedDescription || dish.originalDescription || '';
      const descriptionLines = wrapText(description, font, 9);
      const price = `${menu.currencySymbol || '₹'}${dish.price}`;
      const priceWidth = fontBold.widthOfTextAtSize(price, 11);
      const nameWidth = Math.max(120, contentWidth - priceWidth - 24);
      const nameLines = wrapText(String(dish.name), fontBold, 12, nameWidth);
      const itemHeight = nameLines.length * 16 + descriptionLines.length * 13 + 24;
      if (y - itemHeight < 72) {
        addPage();
        page.drawText(String(category).toUpperCase(), { x: margin, y, size: 11, font: fontBold, color: colors.accent });
        y -= 16;
        page.drawLine({ start: { x: margin, y }, end: { x: pageWidth - margin, y }, thickness: 0.6, color: colors.rule });
        y -= 15;
      }

      nameLines.forEach((line) => {
        page.drawText(line, { x: margin, y, size: 12, font: fontBold, color: colors.ink });
        y -= 16;
      });
      page.drawText(price, { x: pageWidth - margin - priceWidth, y: y + nameLines.length * 16, size: 11, font: fontBold, color: colors.ink });
      for (const line of descriptionLines) {
        page.drawText(line, { x: margin, y, size: 9, font, color: colors.muted });
        y -= 13;
      }
      page.drawLine({ start: { x: margin, y: y + 4 }, end: { x: pageWidth - margin, y: y + 4 }, thickness: 0.35, color: colors.rule });
      y -= 14;
    }
  }

  page.drawLine({ start: { x: margin, y: 48 }, end: { x: pageWidth - margin, y: 48 }, thickness: 0.6, color: colors.rule });
  page.drawText('All items freshly prepared to order. Taxes applicable as per local regulations.', { x: margin, y: 34, size: 8, font, color: colors.muted });
  page.drawText('Buon Appetito • Grazie', { x: margin, y: 21, size: 8, font, color: colors.muted });

  const pdfBytes = await pdfDoc.save();
  const fileName = `menu-${menu.id}.pdf`;
  fs.writeFileSync(path.join(process.cwd(), 'exports', fileName), pdfBytes);
  res.json({ fileUrl: `/exports/${fileName}`, fileName });
});

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`MenuOptimizer API listening on http://localhost:${PORT}`);
});
