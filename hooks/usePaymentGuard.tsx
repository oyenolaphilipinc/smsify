'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function usePaymentGuard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkPayment() {
      const res = await fetch('/api/check-payment');
      const data = await res.json();

      if (!data.hasPaid) {
        router.push('/payment-required');
      } else {
        setLoading(false);
      }
    }

    checkPayment();
  }, [router]);

  return loading;
}
