import { Category, PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
    try {
        // 1. ดึงหมวดหมู่ที่มี parent_id เป็น '66b9e82db21247724ddf0893'
        const categories = await prisma.category.findMany({
            where: {
                parentId: '66b9e863b21247724ddf0894',
            },
            select: {
                id: true,
            },
        });

        // 2. ดึงสินค้า (products) ที่มี categories ตรงกับ id ของหมวดหมู่ที่ได้ดึงมา
        const products = await prisma.product.findMany({
            where: {
                categories: {
                    hasSome: categories.map(cat => cat.id),
                },
            },
        });

        // 3. รวมหมวดหมู่สำหรับสินค้าแต่ละรายการ
        const productsWithCategories = await Promise.all(products.map(async (product) => {
            const productCategories = await prisma.category.findMany({
                where: {
                    id: {
                        in: product.categories,
                    },
                },
            });
            return { ...product, categories: productCategories };
        }));

        return NextResponse.json(productsWithCategories);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' });
    }
}
