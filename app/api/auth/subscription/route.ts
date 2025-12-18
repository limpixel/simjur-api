import { NextResponse } from "next/server";

let subscription: any[] = [];

export async function POST(req: Request) {
  const sub = await req.json();
  subscription.push(sub);

  return NextResponse.json({ success: true });
}
