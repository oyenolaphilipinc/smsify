import { NextRequest, NextResponse } from "next/server";
import { 
  doc, collection, query, where, getDocs, getDoc, setDoc, updateDoc, runTransaction 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import crypto from "crypto";

interface OxaPayCallback {
  status: string;
  trackId: string;
  amount: string;
  email?: string;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const data: OxaPayCallback = JSON.parse(rawBody);
    console.log({ data });

    // 🔒 1️⃣ Verify HMAC Signature
    const hmacHeader = req.headers.get("hmac");
    if (!process.env.OXAPAY_CALLBACK_SECRET) {
      throw new Error("Missing OXAPAY_CALLBACK_SECRET in environment variables");
    }

    const calculatedHmac = crypto
      .createHmac("sha512", process.env.OXAPAY_CALLBACK_SECRET)
      .update(rawBody)
      .digest("hex");

    if (calculatedHmac !== hmacHeader) {
      return NextResponse.json({ error: "Invalid HMAC signature" }, { status: 401 });
    }

    // ✅ 2️⃣ Process only successful transactions
    if (data.status.toLowerCase() !== "paid") {
      return NextResponse.json({ info: "Payment not yet processed" });
    }

    const { trackId, amount, email } = data;
    const numericAmount = parseFloat(amount);

    // 🔍 3️⃣ Get email from Firestore if not provided
    const resolvedEmail = email || await getEmailFromTrackId(trackId);
    if (!resolvedEmail) {
      throw new Error("Email not found for this transaction");
    }

    // 📂 4️⃣ Check if user already has a payment record
    const paymentsRef = collection(db, "payments");
    const q = query(paymentsRef, where("customer.email", "==", resolvedEmail));
    const querySnapshot = await getDocs(q);

    // 🔄 5️⃣ Use Firestore transaction to update or create record
    await runTransaction(db, async (transaction) => {
      if (!querySnapshot.empty) {
        const existingPayment = querySnapshot.docs[0];
        const currentBalance = existingPayment.data();
        const newBalance = currentBalance.amount + numericAmount;

        transaction.set(
          doc(db, "payments", existingPayment.id),
          {
            ...currentBalance,
            amount: newBalance,
            updatedAt: new Date().toISOString(),
            lastTransaction: {
              id: trackId,
              amount: numericAmount,
              date: new Date().toISOString(),
            },
          },
          { merge: true }
        );

      } else {
        const paymentData = {
          transactionId: trackId,
          status: data.status,
          amount: numericAmount,
          customer: {
            email: resolvedEmail,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          transactions: [{
            id: trackId,
            amount: numericAmount,
            date: new Date().toISOString(),
          }],
        };

        transaction.set(doc(db, "payments", trackId), paymentData);
      }
    });

    // ✅ 6️⃣ Mark Payment Request as Completed
    const requestRef = doc(db, "payment_requests", trackId);
    await updateDoc(requestRef, {
      status: "paid",
      completedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Callback error:", error);
    return NextResponse.json({ error: error.message || "Processing failed" }, { status: 500 });
  }
}

// 🔎 Helper Function: Get Email from `payment_requests` if missing
async function getEmailFromTrackId(trackId: string): Promise<string | null> {
  const docRef = doc(db, "payment_requests", trackId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data().email : null;
}
