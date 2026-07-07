import { prisma } from './prisma';

// Get all subcategories
export async function getSubcategories() {
  return prisma.subcategory.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

// Get subcategories for a specific main category (men / women)
export async function getSubcategoriesByMainCategory(mainCategory: string) {
  return prisma.subcategory.findMany({
    where: { mainCategory: { equals: mainCategory, mode: 'insensitive' } },
    orderBy: { name: 'asc' },
  });
}

// Get a single subcategory by its slug
export async function getSubcategoryBySlug(slug: string) {
  return prisma.subcategory.findUnique({ where: { slug } });
}

// Get a subcategory + its products by slug (used on storefront)
export async function getSubcategoryWithProducts(slug: string) {
  const subcategory = await prisma.subcategory.findUnique({ where: { slug } });
  if (!subcategory) return { subcategory: null, products: [] };

  const products = await prisma.product.findMany({
    where: { subcategoryId: subcategory.id },
    include: {
      images: { orderBy: { order: 'asc' } },
      variants: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return { subcategory, products };
}

// Create a new subcategory
export async function createSubcategory(data: { name: string; slug: string; mainCategory: string }) {
  return prisma.subcategory.create({ data });
}

// Update an existing subcategory
export async function updateSubcategory(
  id: string,
  data: { name?: string; slug?: string; mainCategory?: string }
) {
  return prisma.subcategory.update({ where: { id }, data });
}

// Delete a subcategory (products keep existing, just lose the link — see onDelete: SetNull)
export async function deleteSubcategory(id: string) {
  return prisma.subcategory.delete({ where: { id } });
}
