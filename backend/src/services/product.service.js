import { prisma } from "../config/db.js";

// ==================== SLUGIFY HELPER ====================
const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

// ==================== LIST PRODUCTS (public storefront — search, filter, sort, pagination) ====================
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

// ==================== LIST PRODUCTS FOR ADMIN (ownership-filtered) ====================
export const listProductsForAdmin = async (userId, userRole, query) => {
  const { page = 1, limit = 50 } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const where = {};
  // Super Admin sees everything; regular Admin sees only their own + legacy (null owner)
  if (userRole !== "SUPER_ADMIN") {
    where.OR = [{ createdById: userId }, { createdById: null }];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { images: true, category: true },
      orderBy: { createdAt: "desc" },
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

// ==================== GET SINGLE PRODUCT (public) ====================
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

// ==================== OWNERSHIP CHECK HELPER ====================
const assertCanManage = (product, userId, userRole) => {
  const isOwner = product.createdById === userId || product.createdById === null;
  const canManage = userRole === "SUPER_ADMIN" || isOwner;

  if (!canManage) {
    const error = new Error("You can only manage products you created");
    error.statusCode = 403;
    throw error;
  }
};

// ==================== CREATE PRODUCT ====================
export const createProduct = async (data, userId) => {
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
      createdById: userId,
    },
    include: { category: true },
  });
};

// ==================== UPDATE PRODUCT ====================
export const updateProduct = async (id, data, userId, userRole) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  assertCanManage(product, userId, userRole);

  const updateData = { ...data };
  if (data.name) updateData.slug = slugify(data.name);
  if (data.price) updateData.price = Number(data.price);
  if (data.stock) updateData.stock = Number(data.stock);

  return prisma.product.update({ where: { id }, data: updateData });
};

// ==================== DELETE (SOFT) PRODUCT ====================
export const deleteProduct = async (id, userId, userRole) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  assertCanManage(product, userId, userRole);

  await prisma.product.update({ where: { id }, data: { isActive: false } });
};

// ==================== ADD PRODUCT IMAGES ====================
export const addProductImages = async (productId, imageUrls, userId, userRole) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  assertCanManage(product, userId, userRole);

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
export const adjustStock = async (id, quantityChange, userId, userRole) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  assertCanManage(product, userId, userRole);

  return prisma.product.update({
    where: { id },
    data: { stock: { increment: Number(quantityChange) } },
  });
};