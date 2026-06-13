import { prisma } from './prisma';

// 1. Get all products with their associated images and variants
export async function getProducts() {
  return await prisma.product.findMany({
    include: {
      images: { orderBy: { order: 'asc' } },
      variants: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

// 2. Get a single product by ID
export async function getProductById(id: string) {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      images: true,
      variants: true,
    },
  });
}

// 3. Get a single product by slug
export async function getProductBySlug(slug: string) {
  return await prisma.product.findUnique({
    where: { slug },
    include: {
      images: true,
      variants: true,
    },
  });
}

// 4. Get products filtered by category
export async function getProductsByCategory(category: string) {
  return await prisma.product.findMany({
    where: {
      category: {
        equals: category,
        mode: 'insensitive', // Case-insensitive matching
      },
    },
    include: {
      images: { orderBy: { order: 'asc' } },
      variants: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

// 5. Create a new product along with variants and images
export async function createProduct(data: any) {
  const { images, variants, ...productData } = data;
  
  return await prisma.product.create({
    data: {
      ...productData,
      images: {
        create: images.map((img: any) => ({
          url: img.url,
          alt: img.alt || productData.name,
          order: img.order,
        })),
      },
      variants: {
        create: variants.map((variant: any) => ({
          size: variant.size,
          stock: variant.stock,
        })),
      },
    },
  });
}

// 6. Update an existing product
export async function updateProduct(id: string, data: any) {
  const { images, variants, ...productData } = data;

  // Update base product fields
  return await prisma.$transaction(async (tx) => {
    // Delete existing relations to avoid duplicates on rewrite
    if (images) await tx.image.deleteMany({ where: { productId: id } });
    if (variants) await tx.variant.deleteMany({ where: { productId: id } });

    return await tx.product.update({
      where: { id },
      data: {
        ...productData,
        images: images ? {
          create: images.map((img: any) => ({
            url: img.url,
            alt: img.alt || productData.name,
            order: img.order,
          })),
        } : undefined,
        variants: variants ? {
          create: variants.map((variant: any) => ({
            size: variant.size,
            stock: variant.stock,
          })),
        } : undefined,
      },
    });
  });
}

// 7. Delete a product
export async function deleteProduct(id: string) {
  return await prisma.product.delete({
    where: { id },
  });
}

// 8. Helper function to generate clean URL slugs
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}