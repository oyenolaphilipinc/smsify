export interface CustomerData {
    email: string;
    name: string;
    phone_number: string;
  }
  
  export interface PaymentData {
    id: string;
    amount: number;
    createdAt: string;
    customer: CustomerData;
    status: string;
    transactionId: string;
    userId: string;
  }
  
  