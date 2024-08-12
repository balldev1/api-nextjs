import {Category, PrismaClient} from '@prisma/client';
import {NextRequest, NextResponse} from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const response = await prisma.category.findMany()

        return NextResponse.json(response);

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({message: 'Internal Server Error'});
    }
}

export async function POST(request: Request) {
    try {
        const {
            name,
            parentId,
        } = await request.json();

        // ตรวจสอบว่าชื่อสินค้ามีอยู่แล้วในฐานข้อมูลหรือไม่
        const existingProduct = await prisma.category.findFirst({
            where: {
                name: name
            },
        });

        if (existingProduct) {
            return NextResponse.json({ error: 'ชื่อหมวดหมู่นี้มีอยู่แล้ว' });
        }

        // สร้างสินค้าใหม่
        const categories = await prisma.category.create({
            data: {
                name: name || null,
                parentId: parentId || null ,
            },
        });

        return NextResponse.json({ categories });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to create product' });
    }
}