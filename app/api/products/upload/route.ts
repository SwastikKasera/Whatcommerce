import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import ProductModel from '@/app/models/Product.model';

interface ProductRequestBody {
  productName: string;
  productDesc: string;
  productCategory: string;
  productPrice: number;
  productColor: string;
  productSize: string;
  customerId: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as ProductRequestBody;

    const { productName, productDesc, productCategory, productPrice, productColor, productSize, customerId } = body;

    // Basic validation
    if (!productName || !productDesc || !productCategory || !productPrice || !productColor || !productSize || !customerId) {
      return NextResponse.json({ message: 'Some fields are missing in product uploads' }, { status: 400 });
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI as string);

    const newProduct = new ProductModel({
      productName,
      productDesc,
      productCategory,
      productPrice,
      productColor,
      productSize,
      customerId,
    });

    await newProduct.save();

    return NextResponse.json({ message: 'Product uploaded successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error uploading product:', error);
    return NextResponse.json({ message: 'Error uploading product' }, { status: 500 });
  }
}

export async function GET(req: NextRequest){
  return NextResponse.json({ message:"products in upload", status: 200});
}