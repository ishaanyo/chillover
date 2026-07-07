import { prisma } from './prisma';

const productInclude = {
  images: { orderBy: { order: 'asc' as const } },
  variants: true,
  subcategory: true,
};

// 1. Get all products with their associated images and variants
export async function getProducts() {
  return await prisma.product.findMany({
    include: productInclude,
    orderBy: { createdAt: 'desc' },
  });
}

// 2. Get a single product by ID
export async function getProductById(id: string) {
  return await prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });
}

// 3. Get a single product by slug
export async function getProductBySlug(slug: string) {
  return await prisma.product.findUnique({
    where: { slug },
    include: productInclude,
  });
}

// 4. Get products filtered by main category (men / women / all)
export async function getProductsByCategory(category: string) {
  if (category === 'all') {
    return await prisma.product.findMany({
      include: productInclude,
      orderBy: { createdAt: 'desc' },
    });
  }
  return await prisma.product.findMany({
    where: {
      category: {
        equals: category,
        mode: 'insensitive',
      },
    },
    include: productInclude,
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

  return await prisma.$transaction(async (tx) => {
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
