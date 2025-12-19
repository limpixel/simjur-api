'use client';

import Image from "next/image";
import PushNotificationToggle from "@/components/PushNotificationToggle";
import { apiClient } from "@/lib/apiClient";
import { useEffect, useState } from "react";

export default function Home() {
  const [connectionTest, setConnectionTest] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const testConnection = async () => {
    setTesting(true);
    try {
      const result = await apiClient.testConnection();
      setConnectionTest(result);
    } catch (error) {
      setConnectionTest({
        error: "Connection test failed",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    // Test connection on page load
    testConnection();
  }, []);

  return (
    <div className="font-sans min-h-screen bg-gray-50 p-8">
      <main className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Image
            className="dark:invert mx-auto"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <h1 className="text-4xl font-bold text-gray-900">
            Push Notification Demo
          </h1>
          <p className="text-lg text-gray-600">
            Complete implementation with CORS support and backend integration
          </p>
        </div>

        {/* Connection Status */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">API Connection Status</h2>
          
          {testing ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span className="text-gray-600">Testing connection...</span>
            </div>
          ) : connectionTest ? (
            <div className="space-y-2">
              <div className={`p-3 rounded ${
                connectionTest.error 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {connectionTest.error ? (
                  <div>
                    <strong>❌ Connection Failed</strong>
                    <p className="text-sm mt-1">{connectionTest.error}</p>
                    <p className="text-xs mt-1">{connectionTest.details}</p>
                  </div>
                ) : (
                  <div>
                    <strong>✅ Connected Successfully</strong>
                    <p className="text-sm mt-1">CORS is working properly</p>
                  </div>
                )}
              </div>
              <button
                onClick={testConnection}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Retest Connection
              </button>
            </div>
          ) : null}
        </div>

        {/* Push Notification Component */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Push Notifications</h2>
          <PushNotificationToggle />
        </div>

        {/* API Information */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">API Endpoints</h2>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded">
              <strong>Public Push:</strong>
              <code className="block text-sm mt-1">POST /api/push</code>
              <p className="text-sm text-gray-600 mt-1">Send push notifications without authentication</p>
            </div>
            
            <div className="p-3 bg-gray-50 rounded">
              <strong>Authenticated Push:</strong>
              <code className="block text-sm mt-1">POST /api/auth/push</code>
              <p className="text-sm text-gray-600 mt-1">Send push notifications with authentication</p>
            </div>
            
            <div className="p-3 bg-gray-50 rounded">
              <strong>Subscribe Management:</strong>
              <code className="block text-sm mt-1">POST/GET/DELETE /api/auth/push/subscribe</code>
              <p className="text-sm text-gray-600 mt-1">Manage user subscriptions (requires auth)</p>
            </div>
          </div>
        </div>

        {/* Testing Instructions */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Testing Instructions</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold text-gray-700">1. Browser Console Testing:</h3>
              <pre className="bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
{`// Get subscription object
navigator.serviceWorker.ready.then(registration => {
  return registration.pushManager.getSubscription();
}).then(subscription => {
  console.log('Subscription:', JSON.stringify(subscription, null, 2));
  copy(JSON.stringify(subscription));
});`}
              </pre>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700">2. Postman Testing:</h3>
              <pre className="bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
{`POST https://simjur-api.vercel.app/api/push
Headers: Content-Type: application/json
Body: {
  "subscription": { ... },
  "title": "Test Notification",
  "message": "Hello from Postman!",
  "url": "/",
  "icon": "/vercel.svg"
}`}
              </pre>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700">3. Authenticated Testing:</h3>
              <p className="text-gray-600">Add Authorization header: Bearer YOUR_JWT_TOKEN</p>
            </div>
          </div>
        </div>

        {/* CORS Status */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">✅ CORS Configuration</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Access-Control-Allow-Origin: * (configured for development)</li>
            <li>• Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS</li>
            <li>• Access-Control-Allow-Headers: Content-Type, Authorization</li>
            <li>• OPTIONS preflight requests handled automatically</li>
          </ul>
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 pt-8 border-t">
          <p>Push Notification Demo - Built with Next.js, TypeScript, and next-push</p>
        </footer>
      </main>
    </div>
  );
}