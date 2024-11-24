export interface FlutterwaveConfig {
    public_key: string;
    tx_ref: string;
    amount: number;
    currency: string;
    payment_options: string;
    customer: {
      email: string | null | undefined;
      phone_number: string;
      name: string | null | undefined;
    };
    customizations: {
      title: string;
      description: string;
      logo: string;
    };
  }
  
  