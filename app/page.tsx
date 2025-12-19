"use client";

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
        details: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-6 py-10">
      <main className="max-w-5xl mx-auto space-y-10">
        {/* HEADER */}
        <header className="text-center space-y-4">
          <Image
            className="mx-auto dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={160}
            height={34}
            priority
          />
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Push Notification Demo
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Modern Web Push implementation with Next.js & Web Push
          </p>
        </header>

        {/* API STATUS */}
        <section className="rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
            API Connection Status
          </h2>

          {testing ? (
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <span className="h-4 w-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
              Testing connection...
            </div>
          ) : (
            connectionTest && (
              <div
                className={`rounded-lg p-4 text-sm ${
                  connectionTest.error
                    ? "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                    : "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                }`}
              >
                {connectionTest.error ? (
                  <>
                    <p className="font-semibold">❌ Connection Failed</p>
                    <p className="mt-1 text-xs opacity-80">
                      {connectionTest.details}
                    </p>
                  </>
                ) : (
                  <p className="font-semibold">
                    ✅ Connected successfully — CORS OK
                  </p>
                )}
              </div>
            )
          )}

          <button
            onClick={testConnection}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            Retest Connection
          </button>
        </section>

        {/* PUSH TOGGLE */}
        <section className="rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
            Push Notifications
          </h2>
          <PushNotificationToggle />
        </section>

        {/* API INFO */}
        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Public Push",
              endpoint: "POST /api/push",
              desc: "Send push notification without authentication",
            },
            {
              title: "Authenticated Push",
              endpoint: "POST /api/auth/push",
              desc: "Requires JWT authentication",
            },
            {
              title: "Subscription API",
              endpoint: "POST /GET /DELETE /api/auth/push/subscribe",
              desc: "Manage user subscriptions",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-slate-200 dark:border-slate-700 shadow-sm p-5"
            >
              <h3 className="font-semibold text-slate-800 dark:text-white">
                {item.title}
              </h3>
              <code className="block mt-2 text-xs bg-slate-100 dark:bg-slate-900 p-2 rounded">
                {item.endpoint}
              </code>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                {item.desc}
              </p>
            </div>
          ))}
        </section>

        {/* CORS INFO */}
        <section className="rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-5">
          <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
            ✅ CORS Configuration
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
            <li>• Access-Control-Allow-Origin: *</li>
            <li>• Methods: GET, POST, PUT, DELETE, OPTIONS</li>
            <li>• Headers: Content-Type, Authorization</li>
            <li>• Preflight handled correctly</li>
          </ul>
        </section>

        {/* FOOTER */}
        <footer className="text-center text-sm text-slate-500 dark:text-slate-400 pt-6 border-t dark:border-slate-700">
          Push Notification Demo · Next.js · Web Push · Vercel
        </footer>
      </main>
    </div>
  );
}
