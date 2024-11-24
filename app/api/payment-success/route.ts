import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const PaymentSuccess = () => {
  const router = useRouter();
  const { transaction_id, status } = router.query;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await fetch(
          `/api/verifyPayment?transaction_id=${transaction_id}`
        );
        const data = await response.json();

        if (data.status === 'successful') {
          await setDoc(doc(db, 'payments', transaction_id), {
            transactionId: transaction_id,
            status: 'successful',
            amount: data.amount,
            email: data.customer.email,
          });

          router.push('/protected-page');
        } else {
          alert('Payment verification failed');
          router.push('/');
        }
      } catch (error) {
        console.error('Verification error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (transaction_id && status === 'successful') {
      verifyPayment();
    }
  }, [transaction_id, status]);

  if (loading) return <div>Verifying payment...</div>;

  return null;
};

export default PaymentSuccess;
