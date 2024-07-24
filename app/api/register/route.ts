import ConnectMongo from "@/app/lib/ConnectMongo";
import { NextRequest, NextResponse } from "next/server";
import CustomerCreationModel from "@/app/models/CustomerCreation";

interface BusinessRegistration {
    businessName: string;
    website: string;
    businessDesc: string;
    productCategory: string;
}

export async function POST(req: NextRequest) {
    try {
        await ConnectMongo();
        
        // Use req.json() instead of req.body
        const { businessName, website, businessDesc, productCategory } = await req.json() as BusinessRegistration;
        
        if (!businessName || !businessDesc || !productCategory || !website) {
            return NextResponse.json({ message: 'Fill all required customer fields' }, { status: 400 });
        }
        
        const newCustomer = await CustomerCreationModel.create({ businessName, website, productCategory, businessDesc });
        
        return NextResponse.json({ message: 'Customer registered successfully', customer: newCustomer }, { status: 201 });
    } catch (error) {
        console.error('Error in customer registration:', error);
        return NextResponse.json({ message: 'Error in customer registration' }, { status: 500 });
    }
}