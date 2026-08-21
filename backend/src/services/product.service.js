import { prisma } from "../config/db.js";

// ==================== SLUGIFY HELPER ====================
const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

// ==================== LIST PRODUCTS (search, filter, sort, pagination) ====================
export const listProducts = async (query) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    sortBy = "createdAt",
    order = "desc",
    page = 1,
    limit = 12,
  } = query;

  const where = { isActive: true };

  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }

  if (category) {
    where.categoryId = category;
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { images: true, category: true },
      orderBy: { [sortBy]: order },
      skip,
      take: Number(limit),
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

// ==================== GET SINGLE PRODUCT ====================
export const getProductBySlug = async (slug) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: true, category: true, reviews: true },
  });

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return product;
};

// ==================== CREATE PRODUCT ====================
export const createProduct = async (data) => {
  const { name, description, price, discountPct, stock, categoryId } = data;
  const slug = slugify(name);

  return prisma.product.create({
    data: {
      name,
      slug,
      description,
      price: Number(price),
      discountPct: Number(discountPct) || 0,
      stock: Number(stock) || 0,
      categoryId,
    },
    include: { category: true },
  });
};

// ==================== UPDATE PRODUCT ====================
export const updateProduct = async (id, data) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const updateData = { ...data };
  if (data.name) updateData.slug = slugify(data.name);
  if (data.price) updateData.price = Number(data.price);
  if (data.stock) updateData.stock = Number(data.stock);

  return prisma.product.update({ where: { id }, data: updateData });
};

// ==================== DELETE (SOFT) PRODUCT ====================
export const deleteProduct = async (id) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  await prisma.product.update({ where: { id }, data: { isActive: false } });
};

// ==================== ADD PRODUCT IMAGES ====================
export const addProductImages = async (productId, imageUrls) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const images = await prisma.$transaction(
    imageUrls.map((url, index) =>
      prisma.productImage.create({
        data: { productId, url, isPrimary: index === 0 },
      })
    )
  );

  return images;
};

// ==================== UPDATE STOCK ====================
export const adjustStock = async (id, quantityChange) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.product.update({
    where: { id },
    data: { stock: { increment: Number(quantityChange) } },
  });
};