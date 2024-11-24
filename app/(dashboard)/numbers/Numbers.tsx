'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ClipLoader } from 'react-spinners';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { CountrySelector } from '@/components/country-selector';
import { Button } from '@/components/ui/button';

export default function ProtectedContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const verifyPayment = async (userId: string) => {
      try {
        // Create a query to find payments where customer.uid matches the current user's UID
        const paymentsQuery = query(
          collection(db, 'payments'),
          where('customer.uid', '==', userId)
        );

        const querySnapshot = await getDocs(paymentsQuery);

        // Check if any payment document exists with successful status
        const hasValidPayment = querySnapshot.docs.some(
          (doc) => doc.data().status === 'successful'
        );

        return hasValidPayment;
      } catch (error) {
        console.error('Error verifying payment:', error);
        return false;
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const hasValidPayment = await verifyPayment(user.uid);
        if (hasValidPayment) {
          setAuthorized(true);
        } else {
          router.push('/dashboard');
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ClipLoader className="h-5 w-5 text-green-500" />
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Select a Country
        </h1>
        <CountrySelector />
        <Button className="flex justify-center mt-3 mx-auto px-8">
          Get SMS
        </Button>
      </div>
    </main>
  );
}
