'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useFlutterwave, closePaymentModal, FlutterWaveButton } from 'flutterwave-react-v3';
import type { FlutterwaveConfig } from '@/types/flutterwave'

const services = [
  { id: '2336041', name: 'VKontakte', icon: '/vk.png' },
  { id: '2710443', name: 'WeChat', icon: '/wechat.png' },
  { id: '1480932', name: 'Telegram', icon: '/telegram.png' },
  { id: '1208117', name: 'OK', icon: '/ok.png' },
];

const countries = [
  { id: '3388', name: 'Kazakhstan', code: 'KZ', price: 0.19 },
  { id: '2000', name: 'China', code: 'CN', price: 0.28 },
  { id: '49046', name: 'USA', code: 'US', price: 0.15 },
  { id: '29419', name: 'Malaysia', code: 'MY', price: 0.38 },
];

export default function DashboardPage() {
  const [serviceSearch, setServiceSearch] = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const config: FlutterwaveConfig = {
    public_key: "FLWPUBK_TEST-0f4764dff4e84759438ba6595737afe7-X", // Replace with your key
    tx_ref: `tx-${Date.now()}`,
    amount: 5000, // Replace with the actual amount
    currency: 'NGN',
    payment_options: 'card, mobilemoney, ussd',
    customer: {
      email: user?.email, // Replace with user's email
      phone_number: '08012345678', // Optional
      name: user?.displayName, // Replace with user's name
    },
    customizations: {
      title: 'My Payment Title',
      description: 'Payment for items in cart',
      logo: '/flutter.png', // Optional
    },
  };

  const handleSuccess = async (response: any) => {
    console.log('Payment successful:', response);

    try {
      // Ensure we're using string values for Firestore document ID
      const transactionId = String(response.transaction_id);

      // Create a properly structured payment object
      const paymentData = {
        transactionId: transactionId,
        status: response.status,
        amount: Number(response.amount),
        customer: {
          email: user?.email || '',
          uid: user?.uid || '',
          name: user?.displayName || '',
        },
        createdAt: new Date().toISOString(),
      };

      // Save payment details to Firestore
      await setDoc(doc(db, 'payments', transactionId), paymentData);

      toast({
        title: 'Payment Successful',
        description: `Transaction ID: ${transactionId}`,
      });

      // Redirect to the protected page
      router.push('/numbers');
    } catch (error) {
      console.error('Error saving payment to Firestore:', error);
      toast({
        title: 'Error',
        description: 'Failed to save payment details. Please contact support.',
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    console.log('Payment modal closed');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold ml-4">New SMS</h1>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-blue-500">1.</span> Select a service
            </h2>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search by service"
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-blue-50 hover:bg-blue-100 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-200 rounded-full" />
                    <span>{service.name}</span>
                  </div>
                  <span className="text-gray-500">{service.id}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-blue-500">2.</span> Select your country
            </h2>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search by country"
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {countries.map((country) => (
                <div
                  key={country.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-blue-50 hover:bg-blue-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-200 rounded-full" />
                    <span className="text-sm md:text-md">{country.name}</span>
                    <span className="text-gray-500 hidden md:flex">{country.id}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="md:font-semibold text-sm md:text-md hidden md:flex">{country.price} N</span>
                    <FlutterWaveButton
                      public_key = {"FLWPUBK_TEST-0f4764dff4e84759438ba6595737afe7-X"} // Replace with your key
                      tx_ref = {`tx-${Date.now()}`}
                      amount = {5000} // Replace with the actual amount
                      currency = {'NGN'}
                      payment_options = {'card, mobilemoney, ussd'}
                      customer = {{
                        email: `${user?.email}`, // Replace with user's email
                        phone_number: '08012345678', // Optional
                        name: `${user?.displayName}`, // Replace with user's name
                      }}
                      customizations = {{
                        title: 'My Payment Title',
                        description: 'Payment for items in cart',
                        logo: '/flutter.png', // Optional
                      }}
                      text="Pay Now"
                      className="text-sm border px-2 py-1 bg-blue-500 text-white rounded-md"
                      callback={handleSuccess}
                      onClose={handleClose}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-gray-300" />
              <span>Double SMS</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-gray-300" />
              <span>Multiple purchase</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
