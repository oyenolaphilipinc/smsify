'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, ArrowRight, Copy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { PaymentData } from '@/types/payment';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import axios from 'axios';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { getCountries, getServices, getActivationStatus, pollForSMS } from '../sms/api';

interface Service {
  service_id: string;
  name: string;
  icon: string;
}

interface Country {
  country_id: string;
  name: string;
}

export default function DashboardPage() {
  const [payments, setPayments] = useState<PaymentData[]>([])
  const [serviceSearch, setServiceSearch] = useState('');
  const [balance, setBalance] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [showAllServices, setShowAllServices] = useState(false);
  const [showAllCountries, setShowAllCountries] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [activationId, setActivationId] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [smsText, setSmsText] = useState('');
  const { toast } = useToast();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await getServices();
        setServices(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch services. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const data = await getCountries();
        setCountries(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch countries. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  const displayedServices = showAllServices 
    ? filteredServices 
    : filteredServices.slice(0, 4);

  const remainingServicesCount = filteredServices.length - 4;

  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const displayedCountries = showAllCountries
    ? filteredCountries 
    : filteredCountries.slice(0, 4);

  const remainingCountriesCount = filteredCountries.length - 4;

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
  };

  useEffect(() => {
    async function fetchPayments() {
      if (!user) return;

      try {
        const paymentsRef = collection(db, 'payments');
        const q = query(paymentsRef, where('customer.email', '==', user.email));
        const querySnapshot = await getDocs(q);

        const paymentData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as PaymentData[];

        setPayments(paymentData);

        // Calculate total balance in cents
        const totalBalanceCents = paymentData.reduce((acc, payment) => acc + payment.amount, 0);
        setBalance(totalBalanceCents);
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Error fetching payment data',
          variant: 'destructive',
        });
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchPayments();
    }
  }, [user, authLoading]);

  const handleGetNumber = async () => {
    if (!selectedService || !selectedCountry) {
      toast({
        title: 'Error',
        description: 'Please select both a service and a country.',
        variant: 'destructive',
      });
      return;
    }

    const serviceCostCents = 180;

    if (balance <= 0) {
      toast({
        title: 'Insufficient Funds',
        description: 'Your balance is 0. Please top up to proceed.',
        variant: 'destructive',
      });
      return;
    }

    if (balance < serviceCostCents) {
      toast({
        title: 'Insufficient Funds',
        description: `Your balance is insufficient for this service. Please top up to cover the cost of $${(
          serviceCostCents / 100
        ).toFixed(2)}.`,
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        'https://temp-number-api.com/test/api/v1/activation',
        {
          service_id: selectedService.service_id,
          country_id: selectedCountry.country_id,
          max_price: serviceCostCents,
          quality_factor: 10,
        },
        {
          headers: {
            'X-Api-Key': '13586878e3944331a7158fbe936c6d41',
          }
        }
      );

      const { phone, activation_id } = response.data;
      setPhoneNumber(phone);
      setActivationId(activation_id);
      setDialogOpen(true);
    } catch (error) {
      console.error('Error getting number:', error);
      toast({
        title: 'Error',
        description: 'Failed to get a number. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(phoneNumber);
    toast({
      title: 'Copied',
      description: 'Phone number copied to clipboard',
    });
  };

  const handleGetSMS = async () => {
    if (!user || !selectedService || !selectedCountry) return;
  
    try {
      setLoading(true);
      await pollForSMS(
        activationId,
        async (data) => {
          if (data.sms_code && data.sms_text) {
            setSmsCode(data.sms_code);
            setSmsText(data.sms_text);
  
            // Deduct the service cost from the balance
            const serviceCostCents = 1530; // Replace with the actual cost
            const paymentDoc = payments.find((payment) => payment.amount >= serviceCostCents); // Find the document with sufficient balance
  
            if (paymentDoc) {
              const paymentDocRef = doc(db, 'payments', paymentDoc.id);
  
              // Update the amount field
              await updateDoc(paymentDocRef, {
                amount: paymentDoc.amount - serviceCostCents,
              });
  
              // Update local state
              setPayments((prev) =>
                prev.map((p) =>
                  p.id === paymentDoc.id
                    ? { ...p, amount: p.amount - serviceCostCents }
                    : p
                )
              );
  
              setBalance((prevBalance) => prevBalance - serviceCostCents);
              toast({
                title: 'Success',
                description: `Service cost of $${(serviceCostCents / 1700).toFixed(2)} has been deducted.`,
              });
            } else {
              toast({
                title: 'Error',
                description: 'No payment record with sufficient balance found.',
                variant: 'destructive',
              });
            }
            setLoading(false);
          }
        },
        (error) => {
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
          });
          setLoading(false);
        }
      );
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get SMS. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold ml-4">New SMS</h1>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-blue-500">1.</span> Select a service
            </h2>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search by service"
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedServices.map((service) => (
                <div
                  key={service.service_id}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    selectedService?.service_id === service.service_id
                      ? 'bg-blue-200'
                      : 'bg-blue-50 hover:bg-blue-100'
                  } cursor-pointer`}
                  onClick={() => handleServiceSelect(service)}
                >
                  <div className="flex items-center gap-3">
                    <Image src={service.icon || '/placeholder.png'} alt={service.name} width={30} height={30} />
                    <span>{service.name}</span>
                  </div>
                  <span className="text-gray-500">{service.service_id}</span>
                </div>
              ))}
            </div>
          </div>
          {remainingServicesCount > 0 && (
            <Button
              variant="ghost"
              className="w-full mt-4 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
              onClick={() => setShowAllServices(!showAllServices)}
            >
              {showAllServices ? (
                <ChevronUp className="h-4 w-4 mr-2" />
              ) : (
                <ChevronDown className="h-4 w-4 mr-2" />
              )}
              Available services - {filteredServices.length}
            </Button>
          )}

          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-blue-500">2.</span> Select your country
            </h2>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search by country"
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedCountries.map((country) => (
                <div
                  key={country.country_id}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    selectedCountry?.country_id === country.country_id
                      ? 'bg-blue-200'
                      : 'bg-blue-50 hover:bg-blue-100'
                  } cursor-pointer`}
                  onClick={() => handleCountrySelect(country)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-200 rounded-full" />
                    <span className="text-sm md:text-md">{country.name}</span>
                    <span className="text-gray-500 hidden md:flex uppercase">{country.country_id}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {remainingCountriesCount > 0 && (
            <Button
              variant="ghost"
              className="w-full mt-4 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
              onClick={() => setShowAllCountries(!showAllCountries)}
            >
              {showAllCountries ? (
                <ChevronUp className="h-4 w-4 mr-2" />
              ) : (
                <ChevronDown className="h-4 w-4 mr-2" />
              )}
              Available Countries - {filteredCountries.length}
            </Button>
          )}

          <div className="flex gap-4 pt-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-gray-300" />
              <span>Double SMS</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-gray-300" />
              <span>Multiple purchase</span>
            </label>
          </div>
        </div>
      </div>

      <Button
        className="fixed bottom-4 right-4 rounded-full p-3"
        onClick={handleGetNumber}
        disabled={!selectedService || !selectedCountry || loading}
      >
        <ArrowRight className="h-6 w-6" />
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Phone Number</DialogTitle>
            <DialogDescription>
              Your temporary phone number for {selectedService?.name} in {selectedCountry?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-between p-4 bg-gray-100 rounded-md">
            <span className="text-xl font-bold">{`+${phoneNumber}`}</span>
            <Button variant="outline" size="icon" onClick={handleCopyNumber}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={handleGetSMS} disabled={loading}>
              {loading ? 'Waiting for SMS...' : 'Get SMS'}
            </Button>
          </DialogFooter>
          {smsCode && smsText && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <h3 className="font-bold">SMS Received:</h3>
              <p className="text-xl">Code: <span className="font-bold pl-2">{smsCode}</span></p>
              <p className='text-xl'>Message: <span className='font-bold pl-2'>{smsText}</span></p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

