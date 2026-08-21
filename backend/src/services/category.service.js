import { prisma } from "../config/db.js";

// ==================== SLUGIFY HELPER ====================
const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

// ==================== GET ALL CATEGORIES ====================
export const getAllCategories = async () => {
  return prisma.category.findMany({
    include: { children: true },
    where: { parentId: null },
  });
};

// ==================== CREATE CATEGORY ====================
export const createCategory = async ({ name, parentId }) => {
  const slug = slugify(name);

  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) {
    const error = new Error("Category with this name already exists");
    error.statusCode = 409;
    throw error;
  }

  return prisma.category.create({
    data: { name, slug, parentId: parentId || null },
  });
};

// ==================== UPDATE CATEGORY ====================
export const updateCategory = async (id, { name }) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  const data = {};
  if (name) {
    data.name = name;
    data.slug = slugify(name);
  }

  return prisma.category.update({ where: { id }, data });
};

// ==================== DELETE CATEGORY ====================
export const deleteCategory = async (id) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  await prisma.category.delete({ where: { id } });
};