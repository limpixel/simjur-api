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

// Add CORS headers to responses
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function POST(request: NextRequest) {
  try {
    const { subscription, title, message, url, icon } = await request.json();

    if (!subscription || !title || !message) {
      const response = NextResponse.json(
        { error: 'Missing required fields: subscription, title, message' },
        { status: 400 }
      );
      return addCorsHeaders(response);
    }

    const pushServer = getPushServer();
    const result = await pushServer.sendNotification(subscription, {
      title,
      message,
      url: url || '/',
      icon: icon || '/vercel.svg'
    });

    const response = NextResponse.json({ success: true, result });
    return addCorsHeaders(response);
  } catch (error) {
    console.error('Push notification error:', error);
    
    if (error instanceof Error && error.message.includes('VAPID keys are not configured')) {
      const response = NextResponse.json(
        { error: 'Server configuration error: VAPID keys not set' },
        { status: 500 }
      );
      return addCorsHeaders(response);
    }

    const response = NextResponse.json(
      { error: 'Failed to send push notification', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}

export async function GET() {
  const response = NextResponse.json({ 
    message: 'Push notification API endpoint',
    usage: 'POST with subscription, title, message, and optional url, icon',
    endpoints: {
      send: 'POST /api/push',
      auth: {
        send: 'POST /api/auth/push',
        subscribe: 'POST /api/auth/push/subscribe',
        getSubscriptions: 'GET /api/auth/push/subscribe'
      }
    }
  });
  return addCorsHeaders(response);
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  return addCorsHeaders(response);
}