"use client";
import { useState } from "react";
import { DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { PaymentData } from "@/types/payment";
import { useAuth } from '@/hooks/useAuth';

export default function TopUpPage() {
  const { toast } = useToast();
  const [selectedPayment, setSelectedPayment] = useState<string | null>("visa");
  const [selectedAmount, setSelectedAmount] = useState<string | null>("10");
  const [customAmount, setCustomAmount] = useState<string>("");
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Flutterwave configuration
  const config = {
    public_key: "FLWPUBK_TEST-0f4764dff4e84759438ba6595737afe7-X",
    tx_ref: `tx_${Date.now()}`,
    amount: selectedAmount === "other" ? parseFloat(customAmount) || 0 : parseFloat(selectedAmount || "0"),
    currency: "USD",
    payment_options: "card",
    customer: {
      email: user?.email || "user@example.com",
      name: user?.displayName || "John Doe",
      phone_number: "+123456789"
    },
    customizations: {
      title: "Top Up",
      description: "Top up your balance",
      logo: "https://seekicon.com/free-icon-download/next-js_1.png",
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handlePayment = () => {
    const amount = selectedAmount === "other" ? parseFloat(customAmount) : parseFloat(selectedAmount || "0");

    if (isNaN(amount) || amount <= 3) {
      toast({
        title: "Error",
        description: "The least amount for deposit is $3",
        variant: "destructive",
      });
      return;
    }

    // Check if payment method is crypto-related
    if (["crypto", "usdt", "ton"].includes(selectedPayment || "")) {
      if (!user?.email) {
        toast({
          title: "Error",
          description: "Please login to proceed with crypto payment",
          variant: "destructive",
        });
        return;
      }
      
      // Redirect with both email and amount as query parameters
      router.push(`/crypto-payment?email=${encodeURIComponent(user.email)}&amount=${amount}`);
      return;
    }

    // Handle non-crypto payments (Visa)
    if (selectedPayment !== "visa") {
      alert("Please select Visa as the payment method");
      return;
    }

    handleFlutterPayment({
      callback: async (response) => {
        if (response.status === "successful") {
          try {
            const transactionId = String(response.transaction_id);
            const paymentsRef = collection(db, "payments");
            const q = query(paymentsRef, where("customer.email", "==", user?.email || ''));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
              const existingPayment = querySnapshot.docs[0];
              const currentBalance = existingPayment.data() as PaymentData;
              const newBalance = currentBalance.amount + Number(response.amount);

              await setDoc(
                doc(db, "payments", existingPayment.id),
                {
                  ...currentBalance,
                  amount: newBalance,
                  updatedAt: new Date().toISOString(),
                },
                { merge: true }
              );

              toast({
                title: "Balance Updated",
                description: `New Balance: $${newBalance.toLocaleString()}`,
              });
            } else {
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
                title: "Payment Successful",
                description: `Initial Balance: $${Number(response.amount).toLocaleString()}`,
              });
            }

            router.push("/dashboard");
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to update balance. Please contact support.",
              variant: "destructive",
            });
          }
        } else {
          alert("Payment failed.");
        }
        closePaymentModal();
      },
      onClose: () => {
        console.log("Payment modal closed");
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Top up your balance</h1>

        <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
          {/* Step 1: Payment Method */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">1. Choose a payment method</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                className={`flex items-center justify-center gap-3 p-4 rounded-xl border transition-all hover:shadow-md ${
                  selectedPayment === "visa" 
                    ? "border-blue-500 bg-blue-50 shadow-sm" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedPayment("visa")}
              >
                <div className="w-12 h-12 bg-white rounded-lg border flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 10H2M22 12H2M22 14H2M22 16H2M22 18H2M22 20H2M22 22H2M22 8H2M22 6H2M22 4H2M22 2H2M2 2H22V22H2V2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-medium">Pay with Visa</span>
                  <span className="text-sm text-gray-500">Pay with your Credit/Debit Card</span>
                </div>
              </button>

              <button
                className={`flex items-center justify-center gap-3 p-4 rounded-xl border transition-all hover:shadow-md ${
                  selectedPayment === "usdt" 
                    ? "border-blue-500 bg-blue-50 shadow-sm" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedPayment("usdt")}
              >
                <div className="w-12 h-12 bg-[#26A17B] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">$</span>
                  </div>
                <div className="flex flex-col items-start">
                  <span className="font-medium">Pay with Crypto</span>
                  <span className="text-sm text-gray-500">Pay with any network of your choice</span>
                </div>
              </button>
            </div>
          </div>

          {/* Step 2: Amount */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              2. Specify top up amount
              <DollarSign className="w-5 h-5 ml-1 text-blue-500" />
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button
                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all hover:shadow-md ${
                  selectedAmount === "10" 
                    ? "border-blue-500 bg-blue-50 shadow-sm" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedAmount("10")}
              >
                10$
              </button>
              <button
                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all hover:shadow-md ${
                  selectedAmount === "50" 
                    ? "border-blue-500 bg-blue-50 shadow-sm" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedAmount("50")}
              >
                50$
              </button>
              <button
                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all hover:shadow-md ${
                  selectedAmount === "100" 
                    ? "border-blue-500 bg-blue-50 shadow-sm" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedAmount("100")}
              >
                100$
              </button>
              <input
                type="text"
                placeholder="Other amount"
                value={selectedAmount === "other" ? customAmount : ""}
                className="border rounded-xl py-3 px-4 text-center transition-all text-gray-500 border-gray-200 bg-blue-50 hover:border-gray-300 focus:border-blue-500 focus:bg-blue-50 focus:outline-none"
                onClick={() => setSelectedAmount("other")}
                onChange={(e) => {
                  setSelectedAmount("other");
                  setCustomAmount(e.target.value);
                }}
              />
            </div>
          </div>

          {/* Pay Button */}
          <button
            className="w-full sm:w-auto bg-[#0187ff] hover:bg-blue-600 text-white font-medium py-2 px-16 rounded-lg transition-colors"
            onClick={handlePayment}
          >
            Pay
          </button>

          <p className="text-sm text-gray-500 mt-4">You will be redirected to the payment page of the chosen service</p>

          {/* Currency Conversion */}
          <div className="mt-8 text-sm text-gray-600">
            <p>1 ¥ = 11.74 ₽</p>
            <p>1 $ = 85.93 ₽</p>
          </div>
        </div>
      </div>

      {/* Chat Bubble */}
      <div className="fixed bottom-4 right-4 bg-white rounded-full shadow-md p-2">
        <div className="bg-white rounded-full p-2 flex items-center">
          <span className="mr-2">👋</span>
          <span className="text-sm">Hi! Ask me about anything!</span>
        </div>
      </div>
    </div>
  );
}