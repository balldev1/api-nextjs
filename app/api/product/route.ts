import {Category, PrismaClient} from '@prisma/client';
import {NextRequest, NextResponse} from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const response = await prisma.product.findMany()

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
            status,
            price,
            categories,
        } = await request.json();

        // ตรวจสอบว่าชื่อสินค้ามีอยู่แล้วในฐานข้อมูลหรือไม่
        const existingProduct = await prisma.product.findFirst({
            where: {
                name: name
            },
        });

        if (existingProduct) {
            return NextResponse.json({error: 'ชื่อสินค้านี้มีอยู่แล้ว'});
        }

        // สร้างสินค้าใหม่
        const product = await prisma.product.create({
            data: {
                name: name || null,
                status: status || false,
                price: price || null,
                categories: categories || [],
            },
        });

        return NextResponse.json({product});
    } catch (error: any) {
        return NextResponse.json({error: error.message || 'Failed to create product'});
    }
}

// แก้ไขตาม id ที่รับเข้ามา เจาะจงว่า id นี้เท่านั้น
export async function PUT(request: NextRequest) {
    try {
        const { id, name, status, price, categories } = await request.json();

        // ตรวจสอบว่ามีสินค้าด้วย `id` นี้หรือไม่
        const existingProduct:any  = await prisma.product.findUnique({
            where: { id: id },
        });

        if (!existingProduct) {
            return NextResponse.json({ error: 'Product not found' });
        }

        // อัพเดตข้อมูลสินค้า
        const updatedProduct= await prisma.product.update({
            where: { id: id },
            data: {
                name: name || existingProduct.name,
                status: status !== undefined ? status : existingProduct.status,
                price: price !== undefined ? price : existingProduct.price,
                categories: categories !== undefined ? categories : existingProduct.categories,
            },
        });

        return NextResponse.json({ product: updatedProduct });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to update product' });
    }
}

// delete ทุกข้อมูลใน prodoct
export async function DELETE() {
    try {
        // ลบข้อมูลทั้งหมดในตาราง `product`
        await prisma.product.deleteMany();

        return NextResponse.json({ message: 'All products have been deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to delete products' });
    }
}
