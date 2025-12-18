# Environment Variables Setup for Vercel Deployment

## Required Environment Variables

Copy these variables to your Vercel project settings:

### Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### Authentication
```
JWT_SECRET=your-jwt-secret
```

### Push Notification VAPID Keys
```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BK2NMf9MYPbYw88-rEsQ7V-fTs1VJ9AephwQLqeZWax159rXcL4-BVC81CsVffUc7PavQKRRJudwgTUYVB5KWlA
VAPID_PRIVATE_KEY=YPJnjlHKpERnGVjvVAGop8vwkKFMbV4iibWTpa2cXxc
```

## Setup Instructions

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable from above
4. Redeploy your application

## Notes

- `NEXT_PUBLIC_` prefixed variables are available on both client and server side
- Variables without `NEXT_PUBLIC_` prefix are server-side only
- VAPID keys are already generated and ready to use
- Make sure Supabase URLs and keys are correct for your project