'use client'

import { useEffect, useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { format } from 'date-fns'
import { Loader2, AlertCircle } from 'lucide-react'
import { db } from '@/lib/firebase'
import { useAuth } from '@/hooks/useAuth'
import { PaymentData } from '@/types/payment'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function PaymentProfile() {
  const { user, loading: authLoading } = useAuth()
  const [payments, setPayments] = useState<PaymentData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPayments() {
      if (!user) return

      try {
        const paymentsRef = collection(db, 'payments')
        const q = query(paymentsRef, where('customer.email', '==', user.email))
        const querySnapshot = await getDocs(q)
        
        const paymentData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as PaymentData[]

        setPayments(paymentData)
      } catch (err) {
        setError('Error fetching payment data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      fetchPayments()
    }
  }, [user, authLoading])

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please sign in to view your payment history
        </AlertDescription>
      </Alert>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (payments.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          No payment history found
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="md:ml-20">
      <h1 className="text-xl font-bold text-center mb-2 mt-2">Payment History</h1>
      {payments.map((payment) => (
        <Card key={payment.transactionId}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>Transaction ID: {payment.transactionId}</CardDescription>
              </div>
              <Badge 
                variant={payment.status === 'successful' ? 'default' : 'destructive'}
              >
                {payment.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Amount</h3>
                <p className="text-2xl font-bold">
                  ₦{payment.amount.toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                <p className="text-sm">
                  {format(new Date(payment.createdAt), 'PPpp')}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Customer Information
              </h3>
              <div className="grid gap-2">
                <div className="flex justify-between py-1 border-b">
                  <span>Name</span>
                  <span className="font-medium">{payment.customer.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span>Email</span>
                  <span className="font-medium">{payment.customer.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span>Phone</span>
                  <span className="font-medium">{payment.customer.phone_number}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

