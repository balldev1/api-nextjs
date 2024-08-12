// wait test


// import { PrismaClient } from '@prisma/client';
// import { NextRequest, NextResponse } from 'next/server';
//
// const prisma = new PrismaClient();
//
// export async function GET(req: NextRequest) {
//     try {
//         // ดึงค่าของ 'name' จาก query parameters
//         const { name } = req.nextUrl.searchParams;
//
//         let categories;
//         if (name) {
//             // ถ้ามีค่า 'name' ให้ค้นหาหมวดหมู่ที่ตรงกับ 'name' และ 'parentId'
//             categories = await prisma.category.findMany({
//                 where: {
//                     name: name,
//                     parentId: '66b9e82db21247724ddf0893',
//                 },
//                 select: {
//                     id: true,
//                 },
//             });
//         } else {
//             // ถ้า 'name' เป็นค่าว่าง ให้ค้นหาหมวดหมู่ที่มี 'parentId' อย่างเดียว
//             categories = await prisma.category.findMany({
//                 where: {
//                     parentId: '66b9e82db21247724ddf0893',
//                 },
//                 select: {
//                     id: true,
//                 },
//             });
//         }
//
//         // ดึงสินค้า (products) ที่มี categories ตรงกับ id ของหมวดหมู่ที่ได้ดึงมา
//         const products = await prisma.product.findMany({
//             where: {
//                 categories: {
//                     hasSome: categories.map(cat => cat.id),
//                 },
//             },
//         });
//
//         // รวมหมวดหมู่สำหรับสินค้าแต่ละรายการ
//         const productsWithCategories = await Promise.all(products.map(async (product) => {
//             const productCategories = await prisma.category.findMany({
//                 where: {
//                     id: {
//                         in: product.categories,
//                     },
//                 },
//             });
//             return { ...product, categories: productCategories };
//         }));
//
//         return NextResponse.json(productsWithCategories);
//     } catch (error) {
//         console.error('API Error:', error);
//         return NextResponse.json({ message: 'Internal Server Error' });
//     }
// }
