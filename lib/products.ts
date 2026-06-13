import prisma from './prisma';
import { Product } from '@/types'; // Ensure your types file still exists

// Fetch all products
export async function getProducts() {
  return await prisma.product.findMany({
    include: {
      images: { orderBy: { order: 'asc' } },
      variants: true,
    },
    orderBy: { createdAt: 'desc' }
  });
}

// Fetch a single product by slug
export async function getProductBySlug(slug: string) {
  return await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { order: 'asc' } },
      variants: true,
    },
  });
}

// Fetch a single product by ID
export async function getProductById(id: string) {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: 'asc' } },
      variants: true,
    },
  });
}

// Create a new product (This is what your admin form will call)
export async function createProduct(data: any) {
  const { images, variants, ...productData } = data;
  
  return await prisma.product.create({
    data: {
      ...productData,
      images: {
        create: images,
      },
      variants: {
        create: variants,
      }
    },
  });
}