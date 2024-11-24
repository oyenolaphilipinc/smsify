import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, amount } = await request.json();

  if (!email || !amount) {
    return NextResponse.json(
      { error: 'Email and amount are required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
      },
      body: JSON.stringify({
        tx_ref: `tx-${Date.now()}`,
        amount: amount,
        currency: 'USD',
        redirect_url: `${process.env.BASE_URL}/payment-success`,
        customer: {
          email: email,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Payment initialization failed');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error initializing payment:', error);
    return NextResponse.json(
      { error: 'Payment initialization failed' },
      { status: 500 }
    );
  }
}
