"use client"
import { Send, ChevronDown, User, LogOut } from 'lucide-react'
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { FlutterWaveButton } from 'flutterwave-react-v3';
import type { FlutterwaveConfig } from '@/types/flutterwave'

export default function Navbar() {
    const router = useRouter();
    const { toast } = useToast();
    const { user, loading: authLoading } = useAuth();
  
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
    <header className="fixed w-full md:flex ml-8 md:ml-0 md:mt-0 h-16 items-center justify-center bg-white border-b px-4 md:px-6">
      <div className="flex items-center justify-center gap-4 md:px-4">
        <div className="relative flex w-full max-w-lg items-center overflow-hidden rounded-lg border bg-white shadow-sm md:w-auto md:min-w-[200px]">
          <div className="hidden md:flex h-full items-center gap-2 border-r px-3 py-2">
            <Send className="h-5 w-5 text-blue-500" />
            <div className="flex flex-col">
              <div className="font-medium">Connect Telegram Bot</div>
              <div className="text-xs text-muted-foreground">Activate SMS without leaving the messenger!</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-lg border px-4 md:px-3 py-2">
          <span className="text-sm text-muted-foreground">Balance:</span>
          <span className="font-medium">0$</span>
        </div>
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
                      text="Top Up"
                      className="bg-yellow-400 border px-2 py-1 rounded-md font-medium text-black hover:bg-yellow-500"
                      callback={handleSuccess}
                      onClose={handleClose}
                    />
        <Select>
          <SelectTrigger className="w-[44px] border-none p-0">
            <Avatar className="h-8 w-8">
              <AvatarFallback className='bg-blue-300'>U</AvatarFallback>
            </Avatar>
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="profile">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </div>
            </SelectItem>
            <SelectItem value="logout">
              <div className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </header>
  )
}