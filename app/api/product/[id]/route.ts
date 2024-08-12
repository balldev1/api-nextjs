import {Category, PrismaClient} from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
const prisma = new PrismaClient();

// แก้ไขตาม params.id ที่รับเข้ามา
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params; // รับค่า `id` จาก URL
        const { name, status, price, categories } = await req.json();

        // ตรวจสอบว่ามีสินค้าด้วย `id` นี้หรือไม่
        const existingProduct:any = await prisma.product.findUnique({
            where: { id: id },
        });

        if (!existingProduct) {
            return NextResponse.json({ error: 'Product not found' });
        }

        // อัพเดตข้อมูลสินค้า
        const updatedProduct = await prisma.product.update({
            where: { id: id },
            data: {
                name: name || existingProduct.name,
                status: status !== undefined ? status : existingProduct.status,
                price: price !== undefined ? price : existingProduct.price,
                categories: categories || existingProduct.categories,
            },
        });

        return NextResponse.json({ product: updatedProduct });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to update product' });
    }
}

// delete.id = params.id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const {id} = params; // รับค่า `id` จาก URL

        // ตรวจสอบว่ามีสินค้าด้วย `id` นี้หรือไม่
        const existingProduct = await prisma.product.findUnique({
            where: {id: id},
        });

        if (!existingProduct) {
            return NextResponse.json({error: 'Product not found'});
        }

        // ลบข้อมูลสินค้า
        await prisma.product.delete({
            where: {id: id},
        });

        return NextResponse.json({message: 'Product deleted successfully'});
    } catch (error: any) {
        return NextResponse.json({error: error.message || 'Failed to delete product'});
    }
}

