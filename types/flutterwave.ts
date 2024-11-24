export interface FlutterwaveConfig {
    public_key: string;
    tx_ref: string;
    amount: number;
    currency: string;
    payment_options: string;
    customer: {
      email: string;
      phonenumber: string;
      name: string;
    };
    customizations: {
      title: string;
      description: string;
      logo: string;
    };
  }
  
  