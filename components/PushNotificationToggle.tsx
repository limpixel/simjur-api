'use client';

import { useNextPush } from 'next-push/client';

export default function PushNotificationToggle() {
  const { 
    isSupported, 
    subscribed, 
    loading, 
    permission, 
    error, 
    toggle 
  } = useNextPush();

  if (!isSupported) {
    return (
      <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-3 rounded">
        Push notifications are not supported in this browser.
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error: {error.message}
      </div>
    );
  }

  const handleToggle = () => {
    if (loading) return;
    toggle();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Push Notifications</h3>
      
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

        {permission === 'denied' && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded text-sm">
            Please enable notifications in your browser settings to receive push notifications.
          </div>
        )}

        <button
          onClick={handleToggle}
          disabled={loading || permission === 'denied'}
          className={`w-full py-2 px-4 rounded font-medium transition-colors ${
            loading 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : subscribed
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed'
          }`}
        >
          {loading ? 'Loading...' : subscribed ? 'Unsubscribe' : 'Subscribe'}
        </button>
      </div>
    </div>
  );
}