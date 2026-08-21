import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const slugify = (text) =>
  text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

// ==================== CATEGORIES ====================
const categories = [
  { name: "Electronics" },
  { name: "Clothing" },
  { name: "Footwear" },
  { name: "Home & Living" },
  { name: "Accessories" },
];

// ==================== PRODUCTS (6 per category = 30 total) ====================
const productsByCategory = {
  Electronics: [
    { name: "Wireless Bluetooth Headphones", price: 2999, description: "Over-ear wireless headphones with noise cancellation and 30hr battery life." },
    { name: "Smart Watch Series X", price: 4999, description: "Fitness tracking smartwatch with heart rate monitor and AMOLED display." },
    { name: "Portable Bluetooth Speaker", price: 1999, description: "Compact waterproof speaker with deep bass and 12hr playtime." },
    { name: "Wireless Earbuds Pro", price: 2499, description: "True wireless earbuds with active noise cancellation." },
    { name: "USB-C Fast Charger 65W", price: 999, description: "Compact GaN fast charger compatible with laptops and phones." },
    { name: "4K Webcam", price: 3499, description: "Ultra HD webcam with auto-focus, ideal for streaming and calls." },
  ],
  Clothing: [
    { name: "Men's Cotton Casual Shirt", price: 1299, description: "Breathable slim-fit cotton shirt for everyday wear." },
    { name: "Women's Summer Floral Dress", price: 1799, description: "Lightweight floral dress, perfect for summer outings." },
    { name: "Men's Denim Jacket", price: 2499, description: "Classic denim jacket with a modern slim fit." },
    { name: "Women's Yoga Leggings", price: 899, description: "High-waist stretchable leggings for workout and casual wear." },
    { name: "Men's Hooded Sweatshirt", price: 1599, description: "Soft fleece hoodie, perfect for cold weather." },
    { name: "Women's Denim Jeans", price: 1999, description: "Comfortable stretch-fit denim jeans." },
  ],
  Footwear: [
    { name: "Men's Running Shoes", price: 2799, description: "Lightweight running shoes with breathable mesh upper." },
    { name: "Women's Casual Sneakers", price: 2299, description: "Everyday sneakers with cushioned sole." },
    { name: "Men's Formal Leather Shoes", price: 3299, description: "Genuine leather formal shoes for office wear." },
    { name: "Women's Ankle Boots", price: 2999, description: "Stylish ankle boots with a comfortable heel." },
    { name: "Men's Sports Sandals", price: 1299, description: "Durable sandals designed for outdoor activity." },
    { name: "Women's Flat Sandals", price: 999, description: "Comfortable everyday flat sandals." },
  ],
  "Home & Living": [
    { name: "LED Desk Lamp", price: 899, description: "Adjustable LED desk lamp with touch control and 3 brightness modes." },
    { name: "Ceramic Coffee Mug Set", price: 599, description: "Set of 2 ceramic mugs with minimalist design." },
    { name: "Cotton Bedsheet Set", price: 1499, description: "Soft cotton bedsheet with 2 pillow covers." },
    { name: "Wall Clock Modern Design", price: 799, description: "Silent sweep wall clock with a minimalist design." },
    { name: "Aromatic Scented Candles (Set of 3)", price: 699, description: "Long-lasting scented candles for home relaxation." },
    { name: "Storage Organizer Box", price: 899, description: "Foldable fabric storage box for closet organization." },
  ],
  Accessories: [
    { name: "Leather Wallet for Men", price: 999, description: "Genuine leather bifold wallet with card slots." },
    { name: "Women's Handbag", price: 1899, description: "Spacious handbag with adjustable strap." },
    { name: "Aviator Sunglasses", price: 1299, description: "UV-protected aviator sunglasses with metal frame." },
    { name: "Analog Wrist Watch", price: 2199, description: "Classic analog watch with leather strap." },
    { name: "Canvas Backpack", price: 1699, description: "Durable canvas backpack with laptop compartment." },
    { name: "Stainless Steel Water Bottle", price: 599, description: "Insulated bottle, keeps drinks cold for 24 hours." },
  ],
};

// ==================== SEED FUNCTION ====================
async function main() {
  console.log("Seeding categories...");
  const categoryMap = {};

  for (const cat of categories) {
    const slug = slugify(cat.name);
    const existing = await prisma.category.findUnique({ where: { slug } });

    if (existing) {
      categoryMap[cat.name] = existing.id;
      console.log(`  Skipped (exists): ${cat.name}`);
      continue;
    }

    const created = await prisma.category.create({
      data: { name: cat.name, slug },
    });
    categoryMap[cat.name] = created.id;
    console.log(`  Created: ${cat.name}`);
  }

  console.log("\nSeeding products...");
  let count = 0;

  for (const [categoryName, products] of Object.entries(productsByCategory)) {
    const categoryId = categoryMap[categoryName];

    for (const p of products) {
      const slug = slugify(p.name);
      const existing = await prisma.product.findUnique({ where: { slug } });

      if (existing) {
        console.log(`  Skipped (exists): ${p.name}`);
        continue;
      }

      await prisma.product.create({
        data: {
          name: p.name,
          slug,
          description: p.description,
          price: p.price,
          discountPct: Math.random() > 0.5 ? [0, 5, 10, 15][Math.floor(Math.random() * 4)] : 0,
          stock: 50,
          categoryId,
        },
      });
      count++;
      console.log(`  Created: ${p.name}`);
    }
  }

  console.log(`\nDone. ${count} new products created across ${categories.length} categories.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });