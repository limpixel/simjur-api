import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Add CORS headers to responses
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      const response = NextResponse.json(
        { error: 'Authorization required' },
        { status: 401 }
      );
      return addCorsHeaders(response);
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    
    // Verify token and extract user info
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      const response = NextResponse.json(
        { error: 'Invalid authorization token' },
        { status: 401 }
      );
      return addCorsHeaders(response);
    }

    const { subscription } = await request.json();
    
    if (!subscription || !subscription.endpoint) {
      const response = NextResponse.json(
        { error: 'Missing or invalid subscription data' },
        { status: 400 }
      );
      return addCorsHeaders(response);
    }

    // Store subscription in Supabase
    const { data, error } = await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: user.id,
        subscription: subscription,
        endpoint: subscription.endpoint,
        p256dh_key: subscription.keys?.p256dh,
        auth_key: subscription.keys?.auth,
        user_agent: request.headers.get('user-agent'),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      const response = NextResponse.json(
        { error: 'Failed to save subscription' },
        { status: 500 }
      );
      return addCorsHeaders(response);
    }

    const response = NextResponse.json({
      success: true,
      message: 'Subscription saved successfully',
      subscription: data
    });
    return addCorsHeaders(response);

  } catch (error) {
    console.error('Subscribe error:', error);
    const response = NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      const response = NextResponse.json(
        { error: 'Authorization required' },
        { status: 401 }
      );
      return addCorsHeaders(response);
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    
    // Verify token and extract user info
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      const response = NextResponse.json(
        { error: 'Invalid authorization token' },
        { status: 401 }
      );
      return addCorsHeaders(response);
    }

    // Get user's subscriptions
    const { data, error } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      const response = NextResponse.json(
        { error: 'Failed to retrieve subscriptions' },
        { status: 500 }
      );
      return addCorsHeaders(response);
    }

    const response = NextResponse.json({
      success: true,
      subscriptions: data || [],
      count: data?.length || 0
    });
    return addCorsHeaders(response);

  } catch (error) {
    console.error('Get subscriptions error:', error);
    const response = NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      const response = NextResponse.json(
        { error: 'Authorization required' },
        { status: 401 }
      );
      return addCorsHeaders(response);
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    
    // Verify token and extract user info
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      const response = NextResponse.json(
        { error: 'Invalid authorization token' },
        { status: 401 }
      );
      return addCorsHeaders(response);
    }

    const { endpoint } = await request.json();
    
    if (!endpoint) {
      const response = NextResponse.json(
        { error: 'Endpoint is required' },
        { status: 400 }
      );
      return addCorsHeaders(response);
    }

    // Delete subscription
    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('user_id', user.id)
      .eq('endpoint', endpoint);

    if (error) {
      console.error('Database error:', error);
      const response = NextResponse.json(
        { error: 'Failed to delete subscription' },
        { status: 500 }
      );
      return addCorsHeaders(response);
    }

    const response = NextResponse.json({
      success: true,
      message: 'Subscription deleted successfully'
    });
    return addCorsHeaders(response);

  } catch (error) {
    console.error('Delete subscription error:', error);
    const response = NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  return addCorsHeaders(response);
}