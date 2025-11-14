'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 space-y-8 border-t-4 border-orange-500">
        <div className="text-center">
          <div className="text-6xl mb-4">👨‍🍳</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
            Recipe Book
          </h1>
          <p className="text-gray-600">
            Your Personal Cooking Companion
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/login"
            className="block w-full bg-gradient-to-r from-orange-600 to-red-600 text-white text-center py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-red-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Login to Cook
          </Link>
          <Link
            href="/signup"
            className="block w-full border-2 border-orange-500 text-orange-600 text-center py-3 rounded-lg font-semibold hover:bg-orange-50 transition-all"
          >
            Join as Chef
          </Link>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-orange-600">Features:</span>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-orange-500">🍳</span>
                Create & manage recipes
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-500">📸</span>
                Add recipe images
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-500">⭐</span>
                Rate & review dishes
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-500">🔒</span>
                Secure authentication
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
