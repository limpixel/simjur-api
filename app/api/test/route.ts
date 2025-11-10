import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({ 
    message: "✅ API route nyambung mang!"

 });
}
