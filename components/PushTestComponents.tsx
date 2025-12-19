'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/apiClient';

// Icon components for toast notifications
function SuccessIcon() {
  return (
    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );
}

// Helper function to get current subscription
async function getCurrentSubscription() {
  try {
    const registration = await navigator.serviceWorker.ready;
    return await registration.pushManager.getSubscription();
  } catch (error) {
    console.error('Failed to get subscription:', error);
    return null;
  }
}

export function TestBasicNotification() {
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    
    try {
      // Get current subscription
      const subscription = await getCurrentSubscription();
      
      if (!subscription) {
        toast.warning('No Active Subscription', {
          description: 'Please subscribe to push notifications first using the toggle above.',
          icon: <WarningIcon />
        });
        return;
      }

      // Send test notification
      const result = await apiClient.post('/push', {
        subscription,
        title: 'Test Notification',
        message: 'This is a test notification from the demo app! 🎉',
        url: '/',
        icon: '/vercel.svg'
      });

      if (result.success) {
        toast.success('Test Notification Sent!', {
          description: 'Check your browser notifications for the test message.',
          icon: <SuccessIcon />
        });
      } else {
        toast.error('Failed to Send Notification', {
          description: result.error || 'Unknown error occurred',
          icon: <ErrorIcon />
        });
      }
    } catch (error) {
      toast.error('Network Error', {
        description: error instanceof Error ? error.message : 'Failed to connect to server',
        icon: <ErrorIcon />
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleTest}
      disabled={loading}
      className="flex items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
    >
      {loading ? (
        <>
          <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
          Sending...
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Send Test Notification
        </>
      )}
    </button>
  );
}

export function TestCustomNotification() {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('Custom Title');
  const [message, setMessage] = useState('Custom message from the demo!');

  const handleTest = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error('Validation Error', {
        description: 'Title and message are required.',
        icon: <WarningIcon />
      });
      return;
    }

    setLoading(true);
    
    try {
      const subscription = await getCurrentSubscription();
      
      if (!subscription) {
        toast.warning('No Active Subscription', {
          description: 'Please subscribe to push notifications first.',
          icon: <WarningIcon />
        });
        return;
      }

      const result = await apiClient.post('/push', {
        subscription,
        title: title.trim(),
        message: message.trim(),
        url: '/',
        icon: '/vercel.svg'
      });

      if (result.success) {
        toast.success('Custom Notification Sent!', {
          description: `"${title}" - Check your browser notifications.`,
          icon: <SuccessIcon />
        });
      } else {
        toast.error('Failed to Send', {
          description: result.error || 'Unknown error occurred',
          icon: <ErrorIcon />
        });
      }
    } catch (error) {
      toast.error('Network Error', {
        description: error instanceof Error ? error.message : 'Failed to connect to server',
        icon: <ErrorIcon />
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Notification title..."
          className="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Notification message..."
          rows={2}
          className="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
      <button
        onClick={handleTest}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Send Custom Notification
          </>
        )}
      </button>
    </div>
  );
}

export function TestErrorSimulation() {
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    
    try {
      // Test with invalid subscription (should fail)
      const result = await apiClient.post('/push', {
        subscription: null, // Invalid subscription
        title: 'Error Test',
        message: 'This should fail gracefully'
      });

      // If we get here, something unexpected happened
      toast.info('Unexpected Result', {
        description: 'The error test did not fail as expected.',
        icon: <InfoIcon />
      });
    } catch (error) {
      // This is expected
      toast.success('Error Handling Working!', {
        description: 'The API correctly rejected invalid data.',
        icon: <SuccessIcon />
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleTest}
      disabled={loading}
      className="flex items-center justify-center gap-2 rounded-md bg-orange-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
    >
      {loading ? (
        <>
          <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
          Testing...
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Test Error Handling
        </>
      )}
    </button>
  );
}

export function TestConnectionStatus() {
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    
    try {
      const result = await apiClient.testConnection();
      
      if (result.error) {
        toast.error('Connection Failed', {
          description: result.details || 'Unable to connect to the API server.',
          icon: <ErrorIcon />
        });
      } else {
        toast.success('API Connected!', {
          description: 'Server is accessible and CORS is working properly.',
          icon: <SuccessIcon />
        });
      }
    } catch (error) {
      toast.error('Connection Test Failed', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        icon: <ErrorIcon />
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleTest}
      disabled={loading}
      className="flex items-center justify-center gap-2 rounded-md bg-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
    >
      {loading ? (
        <>
          <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
          Testing...
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Test API Connection
        </>
      )}
    </button>
  );
}