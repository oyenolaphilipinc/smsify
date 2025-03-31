'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';


interface PaymentRequest {
 merchant: string;
 amount: number;
 payCurrency: string;
 currency: string;
 callbackUrl: string;
 returnUrl: string;
 email: string;
 description: string;
 orderId: string;
 lifeTime: number;
 feePaidByPayer: number;
 underPaidCover: number;
}


interface PaymentResponse {
 result: number;
 payLink: string;
 message: string;
 trackId: string;
 amount: number;
 currency: string;
 payAmount: number;
 payCurrency: string;
 network: string;
 address: string;
 callbackUrl: string;
 description: string;
 email: string;
 feePaidByPayer: number;
 lifeTime: number;
 orderId: string;
 underPaidCover: number;
 rate: number;
 expiredAt: string;
 createdAt: string;
 QRCode: string;
}


export default function CryptoPaymentPage() {
 const searchParams = useSearchParams();
 const { toast } = useToast();
 const [amount, setAmount] = useState<number>(0);
 const [currency, setCurrency] = useState<string>('USDT');
 const [email, setEmail] = useState<string>('');
 const [description, setDescription] = useState<string>('Account Top-up');
 const [paymentData, setPaymentData] = useState<PaymentResponse | null>(null);
 const [loading, setLoading] = useState<boolean>(false);
 const [paymentStatus, setPaymentStatus] = useState<'waiting' | 'paid' | 'failed'>('waiting');


 // Initialize from URL params
 useEffect(() => {
   const emailParam = searchParams.get('email');
   const amountParam = searchParams.get('amount');
   const descriptionParam = searchParams.get('description');


   if (emailParam) setEmail(decodeURIComponent(emailParam));
   if (amountParam) setAmount(parseFloat(amountParam));
   if (descriptionParam) setDescription(decodeURIComponent(descriptionParam));
 }, [searchParams]);


 // Real-time payment status listener
 useEffect(() => {
   if (!paymentData?.trackId) return;


   const unsubscribe = onSnapshot(
     doc(db, 'payment_requests', paymentData.trackId),
     (doc) => {
       if (doc.exists()) {
         const status = doc.data().status;
         setPaymentStatus(status === 'paid' ? 'paid' : 'waiting');


         if (status === 'paid') {
           toast({
             title: 'Payment Completed',
             description: 'Your balance has been updated successfully',
           });
         }
       }
     }
   );


   return () => unsubscribe();
 }, [paymentData, toast]);


 const handlePayment = async () => {
   if (!email || amount <= 0) {
     toast({
       title: 'Error',
       description: 'Valid email and amount are required',
       variant: 'destructive',
     });
     return;
   }


   setLoading(true);
   setPaymentStatus('waiting');


   try {
     const requestBody: PaymentRequest = {
       merchant: 'sandbox',
       amount,
       payCurrency: 'USDT',
       currency,
       callbackUrl: `https://722d-197-210-226-68.ngrok-free.app/api/payment`,
       returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/crypto-payment?payment=success`,
       email,
       description,
       orderId: `ORDER-${Date.now()}`,
       lifeTime: 300, // 5 minutes
       feePaidByPayer: 0,
       underPaidCover: 0,
     };


     const response = await axios.post<PaymentResponse>(
       'https://api.oxapay.com/merchants/request/',
       requestBody,
       {
         headers: {
           'Content-Type': 'application/json',
           Authorization: `Bearer ${process.env.NEXT_PUBLIC_OXAPAY_API_KEY}`,
         },
       }
     );


     setPaymentData(response.data);


     // Store payment request in Firestore
     await setDoc(doc(db, 'payment_requests', response.data.trackId), {
       trackId: response.data.trackId,
       email,
       amount,
       currency,
       status: 'waiting',
       createdAt: new Date().toISOString(),
       payLink: response.data.payLink,
     });


     toast({
       title: 'Payment Initiated',
       description: 'Redirecting to payment gateway...',
     });


     // Optionally auto-redirect to payment page
     // window.location.href = response.data.payLink;


   } catch (error) {
     console.error('Payment initiation failed', error);
     setPaymentStatus('failed');
     toast({
       title: 'Error',
       description: 'Failed to initiate payment',
       variant: 'destructive',
     });
   } finally {
     setLoading(false);
   }
 };


 return (
   <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
     <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
       <div className="p-8">
         <div className="flex justify-center mb-8">
           <h1 className="text-2xl font-bold text-gray-900">Crypto Payment</h1>
         </div>


         <div className="space-y-6">
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label>
             <Input
               type="number"
               value={amount}
               onChange={(e) => setAmount(Number(e.target.value))}
               min="0.01"
               step="0.01"
               disabled={loading}
             />
           </div>


           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
             <Select value={currency} onValueChange={setCurrency} disabled={loading}>
               <SelectTrigger>
                 <SelectValue placeholder="Select currency" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="USDT">USDT</SelectItem>
                 <SelectItem value="BTC">Bitcoin</SelectItem>
                 <SelectItem value="ETH">Ethereum</SelectItem>
               </SelectContent>
             </Select>
           </div>


           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
             <Input
               type="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               disabled={loading}
             />
           </div>


           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
             <Input
               type="text"
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               disabled={loading}
             />
           </div>


           <Button
             onClick={handlePayment}
             disabled={loading || !email || amount <= 0}
             className="w-full"
           >
             {loading ? (
               <>
                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                 Processing...
               </>
             ) : (
               'Generate Payment'
             )}
           </Button>
         </div>


         {paymentData && (
           <div className="mt-8 border-t pt-6">
             <h3 className="text-lg font-medium mb-4">Payment Details</h3>
            
             <div className="space-y-3">
               <div className="flex justify-between">
                 <span className="text-gray-600">Status:</span>
                 <span className="font-medium capitalize">
                   {paymentStatus === 'paid' ? (
                     <span className="text-green-600">Completed</span>
                   ) : paymentStatus === 'failed' ? (
                     <span className="text-red-600">Failed</span>
                   ) : (
                     <span className="text-yellow-600">Pending</span>
                   )}
                 </span>
               </div>


               <div className="flex justify-between">
                 <span className="text-gray-600">Amount:</span>
                 <span className="font-medium">
                   {paymentData.amount} {paymentData.currency}
                 </span>
               </div>


               <div className="flex justify-between">
                 <span className="text-gray-600">Track ID:</span>
                 <span className="font-mono">{paymentData.trackId}</span>
               </div>


               <div className="flex justify-between">
                 <span className="text-gray-600">Expires:</span>
                 <span className="font-medium">
                   {new Date(parseInt(paymentData.expiredAt) * 1000).toLocaleString()}
                 </span>
               </div>


               {paymentData?.payLink && (
                   <div className="pt-4">
                       <Link href={paymentData.payLink} target="_blank">
                       <Button variant="outline" className="w-full">
                           Open Payment Page
                       </Button>
                       </Link>
                   </div>
               )}


               {paymentData.QRCode && (
                 <div className="flex flex-col items-center pt-4">
                   <p className="text-sm text-gray-500 mb-2">Scan QR Code</p>
                   <img
                     src={`data:image/png;base64,${paymentData.QRCode}`}
                     alt="Payment QR Code"
                     className="w-40 h-40"
                   />
                 </div>
               )}
             </div>
           </div>
         )}
       </div>
     </div>
   </div>
 );
}