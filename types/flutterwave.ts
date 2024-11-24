export interface FlutterwaveConfig {
    public_key: string | undefined;
    tx_ref: string;
    amount: number;
    currency: string;
    payment_options: string;
    customer: {
      email: string | null | undefined;
      phonenumber: string;
      name: string | null | undefined;
    };
    customizations: {
      title: string;
      description: string;
      logo: string;
    };
  }
  
  