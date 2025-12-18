import { NextRequest, NextResponse } from 'next/server';
import { createServerPush } from 'next-push/server';

function getPushServer() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!publicKey || !privateKey) {
    throw new Error('VAPID keys are not configured. Please set NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY in environment variables.');
  }

  return createServerPush('admin@simjur.com', {
    publicKey,
    privateKey
  });
}

export async function POST(request: NextRequest) {
  try {
    const { subscription, title, message, url, icon } = await request.json();

    if (!subscription || !title || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: subscription, title, message' },
        { status: 400 }
      );
    }

    const pushServer = getPushServer();
    const result = await pushServer.sendNotification(subscription, {
      title,
      message,
      url: url || '/',
      icon: icon || '/vercel.svg'
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Push notification error:', error);
    
    if (error instanceof Error && error.message.includes('VAPID keys are not configured')) {
      return NextResponse.json(
        { error: 'Server configuration error: VAPID keys not set' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send push notification' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Push notification API endpoint',
    usage: 'POST with subscription, title, message, and optional url, icon'
  });
}