'use client';

import { useNextPush } from 'next-push/client';
import { useState, useEffect } from 'react';

interface PushError {
  type?: string;
  message: string;
}

interface SubscriptionResponse {
  success: boolean;
  subscriptions?: any[];
  error?: string;
  details?: string;
}

export default function PushNotificationToggle() {
  const { 
    isSupported, 
    subscribed, 
    loading, 
    permission, 
    error, 
    subscription,
    toggle,
    subscribe,
    unsubscribe 
  } = useNextPush();

  const [backendError, setBackendError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Get token from localStorage or context (implementasi sesuai kebutuhan)
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    setToken(savedToken);
  }, []);

  // Save subscription to backend
  const saveSubscriptionToBackend = async (subscriptionData: any) => {
    if (!token) {
      console.warn('No auth token available, skipping backend subscription save');
      return;
    }

    setIsSaving(true);
    setBackendError(null);

    try {
      const response = await fetch('https://simjur-api.vercel.app/api/auth/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          subscription: subscriptionData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result: SubscriptionResponse = await response.json();
      if (result.success) {
        console.log('Subscription saved to backend successfully');
      } else {
        throw new Error(result.error || 'Failed to save subscription');
      }
    } catch (error) {
      console.error('Failed to save subscription to backend:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Better error handling for specific CORS issues
      if (errorMessage.includes('CORS') || errorMessage.includes('fetch')) {
        setBackendError('CORS Error: Unable to connect to server. Please check server configuration.');
      } else if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        setBackendError('Authentication required. Please log in again.');
      } else {
        setBackendError(`Backend error: ${errorMessage}`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Remove subscription from backend
  const removeSubscriptionFromBackend = async (subscriptionData: any) => {
    if (!token) return;

    try {
      await fetch('https://simjur-api.vercel.app/api/auth/push/subscribe', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          endpoint: subscriptionData?.endpoint
        })
      });
    } catch (error) {
      console.error('Failed to remove subscription from backend:', error);
    }
  };

  const handleToggle = async () => {
    if (loading || isSaving) return;
    setBackendError(null);

    if (subscribed && subscription) {
      // Unsubscribe
      try {
        const unsubResult = await unsubscribe();
        if (unsubResult) {
          await removeSubscriptionFromBackend(subscription);
        }
      } catch (error) {
        setBackendError('Failed to unsubscribe');
      }
    } else {
      // Subscribe
      try {
        const subResult = await subscribe();
        if (subResult) {
          // Wait a moment for subscription to be available
          setTimeout(() => {
            const currentSubscription = navigator.serviceWorker.ready.then(registration => 
              registration.pushManager.getSubscription()
            );
            currentSubscription.then(sub => {
              if (sub) {
                saveSubscriptionToBackend(sub);
              }
            });
          }, 1000);
        }
      } catch (error) {
        const err = error as PushError;
        setBackendError(`Subscription failed: ${err.message}`);
      }
    }
  };

  const getErrorMessage = () => {
    if (backendError) return backendError;
    if (error) {
      switch (error.type) {
        case 'PERMISSION_DENIED':
          return 'Notifications blocked. Please enable in browser settings.';
        case 'VAPID_MISSING':
          return 'Server configuration error. Please contact support.';
        case 'NOT_SUPPORTED':
          return 'Push notifications not supported in this browser.';
        default:
          return error.message;
      }
    }
    return null;
  };

  if (!isSupported) {
    return (
      <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-3 rounded">
        Push notifications are not supported in this browser.
      </div>
    );
  }

  const errorMessage = getErrorMessage();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Push Notifications</h3>
      
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {errorMessage}
        </div>
      )}
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Status:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            subscribed 
              ? 'bg-green-100 text-green-800' 
              : permission === 'denied'
              ? 'bg-red-100 text-red-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {subscribed ? 'Subscribed' : permission === 'denied' ? 'Blocked' : 'Not Subscribed'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-700">Permission:</span>
          <span className="capitalize text-gray-600">{permission}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-700">Backend Sync:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isSaving 
              ? 'bg-yellow-100 text-yellow-800'
              : backendError || !token
              ? 'bg-red-100 text-red-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {isSaving ? 'Saving...' : backendError ? 'Failed' : token ? 'Connected' : 'No Auth'}
          </span>
        </div>

        {permission === 'denied' && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded text-sm">
            Please enable notifications in your browser settings to receive push notifications.
          </div>
        )}

        {!token && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded text-sm">
            Please log in to enable push notification syncing across devices.
          </div>
        )}

        <button
          onClick={handleToggle}
          disabled={loading || isSaving || permission === 'denied'}
          className={`w-full py-2 px-4 rounded font-medium transition-colors ${
            loading || isSaving
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : subscribed
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed'
          }`}
        >
          {loading || isSaving ? 'Loading...' : subscribed ? 'Unsubscribe' : 'Subscribe'}
        </button>

        <div className="text-xs text-gray-500 mt-3">
          <p>• Notifications will appear even when this tab is closed</p>
          <p>• Subscription is synced across devices when logged in</p>
          {token && <p>• Server connection: Available</p>}
        </div>
      </div>
    </div>
  );
}