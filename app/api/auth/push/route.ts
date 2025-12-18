import { NextRequest, NextResponse } from "next/server";
import { createServerPush } from "next-push/server";
const pushServer = createServerPush("admin@simjur.com", {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  privateKey: process.env.VAPID_PRIVATE_KEY!,
});
export async function POST(request: NextRequest) {
  try {
    const { subscription, title, message, url, icon } = await request.json();
    if (!subscription || !title || !message) {
      return NextResponse.json(
        { error: "Missing required fields: subscription, title, message" },
        { status: 400 },
      );
    }
    const result = await pushServer.sendNotification(subscription, {
      title,
      message,
      url: url || "/",
      icon: icon || "/vercel.svg",
    });
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Push notification error:", error);
    return NextResponse.json(
      { error: "Failed to send push notification" },
      { status: 500 },
    );
  }
}
export async function GET() {
  return NextResponse.json({
    message: "Push notification API endpoint",
    usage: "POST with subscription, title, message, and optional url, icon",
  });
}
