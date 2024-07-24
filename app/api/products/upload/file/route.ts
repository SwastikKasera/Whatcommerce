import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    
}
export async function GET(req:NextRequest){
    return NextResponse.json({ message:"products upload using file", status: 200});
}