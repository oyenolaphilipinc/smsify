"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PaymentData } from "@/types/payment";

interface PaymentRequest {
    merchant: string;
    amount: number;
    payCurrency: string;
    currency: string;
    callbackUrl: string;
    success_url: string;
    fail_url: string;
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
    const [currency, setCurrency] = useState<string>("USDT");
    const [email, setEmail] = useState<string>("");
    const [description, setDescription] = useState<string>("Account Top-up");
    const [paymentData, setPaymentData] = useState<PaymentResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Get email and amount from URL params on mount
    useEffect(() => {
        const emailParam = searchParams.get('email');
        const amountParam = searchParams.get('amount');
        
        if (emailParam) setEmail(decodeURIComponent(emailParam));
        if (amountParam) setAmount(parseFloat(amountParam));
    }, [searchParams]);

    const handlePayment = async () => {
        if (!email || amount <= 0) {
            toast({
                title: "Error",
                description: "Email and valid amount are required",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            const requestBody: PaymentRequest = {
                merchant: "sandbox",
                amount,
                payCurrency: "USDT",
                currency,
                callbackUrl: "https://yourdomain.com/api/payment-callback",
                success_url: "https://yourdomain.com/payment-success",
                fail_url: "https://yourdomain.com/payment-failed",
                email,
                description,
                orderId: `ORDER-${Date.now()}`,
                lifeTime: 300,
                feePaidByPayer: 0,
                underPaidCover: 0
            };

            const response = await axios.post<PaymentResponse>(
                "https://api.oxapay.com/merchants/request/",
                requestBody,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer BU05T8-6LU7W8-LEF6GM-P79BR7`,
                    },
                }
            );
            console.log("API Response:", response.data);
            setPaymentData(response.data);
        } catch (error) {
            console.error("Payment initiation failed", error);
            toast({
                title: "Error",
                description: "Failed to generate payment request",
                variant: "destructive",
            });
        }
        setLoading(false);
    };

    // Handle successful payment confirmation (you might want to call this via callback)
    const handlePaymentSuccess = async (trackId: string) => {
        try {
            const paymentsRef = collection(db, "payments");
            const q = query(paymentsRef, where("customer.email", "==", email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const existingPayment = querySnapshot.docs[0];
                const currentBalance = existingPayment.data() as PaymentData;
                const newBalance = currentBalance.amount + amount;

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
                    transactionId: trackId,
                    status: "successful",
                    amount: amount,
                    customer: {
                        email: email,
                    },
                    createdAt: new Date().toISOString(),
                };
                await setDoc(doc(db, 'payments', trackId), paymentData);

                toast({
                    title: "Payment Successful",
                    description: `Initial Balance: $${amount.toLocaleString()}`,
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update balance",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Crypto Payment</h1>

                <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label>
                            <input 
                                type="number" 
                                value={amount} 
                                onChange={(e) => setAmount(Number(e.target.value))} 
                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                disabled
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                            <select 
                                value={currency} 
                                onChange={(e) => setCurrency(e.target.value)} 
                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="USDT">USDT</option>
                                <option value="BTC">BTC</option>
                                <option value="ETH">ETH</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                disabled
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <input 
                                type="text" 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <button 
                            onClick={handlePayment} 
                            className="w-full bg-[#0187ff] hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-xl transition-colors disabled:bg-gray-400"
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Generate Payment Address"}
                        </button>
                    </div>

                    {paymentData && (
                        <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">Payment Instructions</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Track ID:</span>
                                    <span className="font-medium">{paymentData.trackId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Link:</span>
                                    <Link href={paymentData.payLink} className="font-medium">{paymentData.payLink}</Link>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Expires:</span>
                                    <span className="font-medium">{new Date(Number(paymentData.expiredAt) * 1000).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}