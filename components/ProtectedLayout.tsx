'use client';

import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { useEffect } from 'react';
import { ClipLoader } from 'react-spinners';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login'); // Redirect to login page if not authenticated
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <ClipLoader className="h-5 w-5 text-green-500" />
      </div>
    ); // You can replace this with a loading spinner
  }

  if (!user) {
    return null; // This prevents the protected content from flashing before redirect
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-4 ml-10 md:ml-64">{children}</main>
    </div>
  );
}
