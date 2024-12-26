'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { FlutterWaveButton } from 'flutterwave-react-v3';
import { getCountries, getServices } from '../sms/api'
import Image from 'next/image';

interface Service {
  service_id: string
  name: string
  icon: string
}

interface Country {
  country_id: string,
  name: string
}

const countries = [
  { id: '3388', name: 'Kazakhstan', code: 'KZ', price: 0.19 },
  { id: '2000', name: 'China', code: 'CN', price: 0.28 },
  { id: '49046', name: 'USA', code: 'US', price: 0.15 },
  { id: '29419', name: 'Malaysia', code: 'MY', price: 0.38 },
];

export default function DashboardPage() {
  const [serviceSearch, setServiceSearch] = useState('');
  const [services, setServices] = useState<Service[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [showAllServices, setShowAllServices] = useState(false)
  const [showAllCountries, setShowAllCountries] = useState(false)
  const [countrySearch, setCountrySearch] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const data = await getServices()
        setServices(data)
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch services. Please try again later.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true)
        const data = await getCountries()
        setCountries(data)
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch services. Please try again later.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(serviceSearch.toLowerCase())
  )

  const displayedServices = showAllServices 
    ? filteredServices 
    : filteredServices.slice(0, 4)

  const remainingServicesCount = filteredServices.length - 4

  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(countrySearch.toLowerCase())
  )

  const displayedCountries = showAllCountries
    ? filteredCountries 
    : filteredCountries.slice(0, 4)

  const remainingCountriesCount = filteredCountries.length - 4

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
                  className="flex items-center justify-between p-4 rounded-lg bg-blue-50 hover:bg-blue-100 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Image src={service.icon || '/placeholder.png'} alt='Hello' width={30} height={30} />
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
                  className="flex items-center justify-between p-4 rounded-lg bg-blue-50 hover:bg-blue-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-200 rounded-full" />
                    <span className="text-sm md:text-md">{country.name}</span>
                    <span className="text-gray-500 hidden md:flex">{country.country_id}</span>
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
    </div>
  );
}
