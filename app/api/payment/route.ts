import { NextRequest, NextResponse } from "next/server";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import crypto from "crypto";

interface OxaPayCallback {
    status: string;
    trackId: string;
    amount: string;
    currency: string;
    payAmount: string;
    payCurrency: string;
    rate: number;
    fee: number;
    orderId: string;
    description: string;
    email?: string | null; // Might be included depending on OxaPay config
    createdAt: string;
    paidAt?: string;
}

const API_SECRET_KEY = process.env.OXAPAY_API_SECRET || "your-secret-key-here";

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        const data: OxaPayCallback = JSON.parse(rawBody);

        // Verify HMAC signature
        const hmacHeader = req.headers.get("hmac");
        if (!hmacHeader) {
            return NextResponse.json({ message: "HMAC signature missing" }, { status: 400 });
        }
        const calculatedHmac = crypto.createHmac("sha256", API_SECRET_KEY).update(rawBody).digest("hex");
        if (calculatedHmac !== hmacHeader) {
            return NextResponse.json({ message: "Invalid HMAC signature" }, { status: 401 });
        }

        if (data.status === "Paid") {
            const trackId = data.trackId;
            let email = data.email;

            // If email isn't in callback, fetch it from payment_requests
            if (!email) {
                email = await getEmailFromTrackId(trackId);
                if (!email) {
                    return NextResponse.json(
                        { message: "Email not found for this trackId" },
                        { status: 400 }
                    );
                }
            }

            const amount = parseFloat(data.amount);

            // Update balance in Firestore
            const paymentsRef = collection(db, "payments");
            const q = query(paymentsRef, where("customer.email", "==", email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const existingPayment = querySnapshot.docs[0];
                const currentBalance = existingPayment.data();
                const newBalance = currentBalance.amount + amount;

                await setDoc(
                    doc(db, "payments", existingPayment.id),
                    {
                        ...currentBalance,
                        amount: newBalance,
                        updatedAt: new Date().toISOString(),
                        lastTransactionId: trackId,
                    },
                    { merge: true }
                );

                console.log(`Balance updated for ${email}: $${newBalance}`);
            } else {
                const newPaymentData = {
                    transactionId: trackId,
                    status: "successful",
                    amount: amount,
                    customer: { email },
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                await setDoc(doc(db, "payments", trackId), newPaymentData);
                console.log(`New payment record created for ${email}: $${amount}`);
            }

            // Update payment_requests status
            await setDoc(
                doc(db, "payment_requests", trackId),
                { status: "completed", updatedAt: new Date().toISOString() },
                { merge: true }
            );

            return NextResponse.json({ message: "Payment processed successfully" });
        }

        return NextResponse.json({ message: "Payment status received, no action taken" });
    } catch (error) {
        console.error("Error processing callback:", error);
        return NextResponse.json(
            { message: "Error processing payment callback" },
            { status: 500 }
        );
    }
}

async function getEmailFromTrackId(trackId: string): Promise<string | null> {
    const paymentSnap = await getDocs(
        query(collection(db, "payment_requests"), where("trackId", "==", trackId))
    );
    if (!paymentSnap.empty) {
        return paymentSnap.docs[0].data().email || null;
    }
    return null;
}

export async function GET() {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}