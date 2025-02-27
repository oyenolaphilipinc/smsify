"use client"

import { useState, useEffect } from "react";
import { ChevronDown, LogOut, Send, User } from 'lucide-react'
import { getAuth, signOut } from "firebase/auth";
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { db } from '@/lib/firebase';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { PaymentData } from '@/types/payment'
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { FlutterWaveButton } from 'flutterwave-react-v3';

export default function Navbar() {
    const [payments, setPayments] = useState<PaymentData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter();
    const { toast } = useToast();
    const { user, loading: authLoading } = useAuth();

    const handleLogout = async () => {
      const auth = getAuth();
      try {
        await signOut(auth);
        toast({
          title: "Logged out",
          description: "You have been successfully logged out.",
        });
        router.push("/login"); // Redirect to the home page or login page
      } catch (error) {
        console.error("Logout failed:", error);
        toast({
          title: "Error",
          description: "Failed to log out. Please try again.",
          variant: "destructive",
        });
      }
    };

    const handleClick = () => {
      router.push("/top-up")
    }
  
    const handleSuccess = async (response: any) => {
      console.log('Payment successful:', response);
    
      try {
        const transactionId = String(response.transaction_id);
    
        // Fetch the existing payment document for this user
        const paymentsRef = collection(db, 'payments');
        const q = query(paymentsRef, where('customer.email', '==', user?.email || ''));
        const querySnapshot = await getDocs(q);
    
        let existingPayment = null;
    
        if (!querySnapshot.empty) {
          existingPayment = querySnapshot.docs[0]; // Assuming only one document per user
        }
    
        if (existingPayment) {
          // Update the existing document with the new balance
          const existingData = existingPayment.data() as PaymentData;
          const newBalance = existingData.amount + Number(response.amount);
    
          await setDoc(doc(db, 'payments', existingPayment.id), {
            ...existingData,
            amount: newBalance,
            updatedAt: new Date().toISOString(), // Optional: Track update time
          });
    
          toast({
            title: 'Balance Updated',
            description: `New Balance: $${convertNaira(newBalance).toLocaleString()}`,
          });
        } else {
          // Create a new payment document if none exists
          const paymentData = {
            transactionId,
            status: response.status,
            amount: Number(response.amount),
            customer: {
              email: user?.email || '',
              uid: user?.uid || '',
              name: user?.displayName || '',
            },
            createdAt: new Date().toISOString(),
          };
    
          await setDoc(doc(db, 'payments', transactionId), paymentData);
    
          toast({
            title: 'Payment Successful',
            description: `Transaction ID: ${transactionId}`,
          });
        }
    
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

    const convertNaira = (balance: any) => {
        return balance / 1700
    }
    useEffect(() => {
      async function fetchPayments() {
        if (!user) return;
    
        try {
          const paymentsRef = collection(db, 'payments');
          const q = query(paymentsRef, where('customer.email', '==', user.email));
          const querySnapshot = await getDocs(q);
    
          if (querySnapshot.empty) {
            // Create default payment data if no payments exist
            const defaultPayment: PaymentData = {
              id: `default-${Date.now()}`, // Unique identifier (use transactionId as id)
              transactionId: `default-${Date.now()}`,
              userId: user.uid || '', // Use user.uid as userId
              status: 'default', // Default status
              amount: 0, // Initial amount
              customer: {
                email: user.email || '',
                phone_number: "optional",
                name: user.displayName || '',
              },
              createdAt: new Date().toISOString(),
            };
    
            await setDoc(doc(db, 'payments', defaultPayment.id), defaultPayment);
    
            setPayments([defaultPayment]); // Update state with the default payment
          } else {
            const paymentData = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            })) as PaymentData[];
    
            setPayments(paymentData);
          }
        } catch (err) {
          setError('Error fetching payment data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    
      if (!authLoading) {
        fetchPayments();
      }
    }, [user, authLoading]);
    
    

  return (
    <nav className="w-full border-b border-[#dee2e6] bg-white px-4 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="hidden md:flex md:items-center gap-3 ml-16 border px-6 py-2 rounded-md border-blue-500">
          <div className="rounded-md bg-[#0088cc] p-2">
            <Send className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-medium">Connect Telegram Bot</h2>
            <p className="text-sm text-[#6c757d]">
              Activate SMS without leaving the messenger!
            </p>
          </div>
        </div>
        <div className="ml-8 md:ml-0 flex items-center gap-4">
        {payments.map((payment) => (
            <div key={payment.transactionId} className="flex items-center gap-4 border px-4 py-2 border-yellow-500 rounded-md">
                <div className="text-sm md:text-md flex flex-col mr-2 ml-2 text-gray-500">
                    Balance:{" "}
                    <span className="text-black font-bold">$ {payment.amount}</span>
                </div>
                <Button className="bg-[#ffc700] font-medium text-sm md:text-md text-black hover:bg-[#ffc700]/90 px-2 md:px-4 py-2 rounded-md" onClick={handleClick}>Top up</Button>
            </div>
        ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 border-[#dee2e6]">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e9ecef]">
                  <User className="h-4 w-4 text-[#6c757d]" />
                </div>
                <ChevronDown className="h-4 w-4 text-[#6c757d]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-600">
                <LogOut className="h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}

