'use client'

import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { InfoIcon as InfoCircle, Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { ClipLoader } from 'react-spinners'
import { query, collection, where, getDocs } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Activation {
  id: string
  phone: string
  sms_code: string
  country: string
  service: string
  status: 'pending' | 'active' | 'completed'
}

const services = [
  { id: '7eleven', name: '7-Eleven' },
  { id: 'walmart', name: 'Walmart' },
  {id: 'telegram', name: 'Telegram'},
  // Add more services as needed
]

const countries = [
  { id: 'us', name: 'United States' },
  { id: 'ca', name: 'Canada' },
  // Add more countries as needed
]

export default function ProtectedContent() {
  const router = useRouter()
  const [serviceId, setServiceId] = useState<string>('')
  const [countryId, setCountryId] = useState<string>('')
  const [activations, setActivations] = useState<Activation[]>([])
  const [filter, setFilter] = useState('')
  const [pageSize, setPageSize] = useState('10')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const verifyPayment = async (userId: string) => {
      try {
        const paymentsQuery = query(
          collection(db, 'payments'),
          where('customer.uid', '==', userId)
        )
        const querySnapshot = await getDocs(paymentsQuery)
        return querySnapshot.docs.some(
          (doc) => doc.data().status === 'successful'
        )
      } catch (error) {
        console.error('Error verifying payment:', error)
        return false
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const hasValidPayment = await verifyPayment(user.uid)
        if (hasValidPayment) {
          setAuthorized(true)
        } else {
          router.push('/dashboard')
        }
      } else {
        router.push('/login')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const handleOrder = async () => {
    if (!serviceId || !countryId) {
      toast({
        title: "Error",
        description: "Please select both a service and a country.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await axios.post(
        'https://temp-number-api.com/test/api/v1/activation',
        {
          service_id: serviceId,
          country_id: countryId,
          max_price: 90,
          quality_factor: 10
        },
        {
          headers: {
            "X-Api-Key": "13586878e3944331a7158fbe936c6d41"
          }
        }
      )

      // Create a new activation from the response
      const newActivation: Activation = {
        id: response.data.activation_id || Math.random().toString(36).substr(2, 9),
        phone: response.data.phone || 'Pending...',
        sms_code: response.data.sms_code || '',
        country: countries.find(c => c.id === countryId)?.name || countryId,
        service: services.find(s => s.id === serviceId)?.name || serviceId,
        status: 'pending'
      }

      // Add the new activation to the beginning of the list
      setActivations(prev => [newActivation, ...prev])

      toast({
        title: "Success",
        description: "SMS order placed successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get SMS. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ClipLoader className="h-5 w-5 text-green-500" />
      </div>
    )
  }

  if (!authorized) {
    return null
  }

  const filteredActivations = activations.filter(activation => {
    const searchTerm = filter.toLowerCase()
    return (
      activation.phone.toLowerCase().includes(searchTerm) ||
      activation.country.toLowerCase().includes(searchTerm) ||
      activation.service.toLowerCase().includes(searchTerm)
    )
  })

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100">
      <div className="md:flex md:justify-center mb-8 pt-8">
        <div className="w-80 mx-auto md:w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            SMS Order System
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select onValueChange={setServiceId}>
              <SelectTrigger className="w-full mb-4">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={setCountryId}>
              <SelectTrigger className="w-full mb-4">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.id} value={country.id}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleOrder} disabled={isLoading} className="w-full mt-4">
            {isLoading ? "Ordering..." : "Get Number"}
          </Button>
        </div>
      </div>

      <div className="w-80 mx-auto md:w-9/12 md:mx-auto p-6 rounded-lg bg-white text-gray-800 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Receive SMS</h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <InfoCircle className="h-5 w-5" />
                  <span className="sr-only">How it Works</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Learn more about receiving SMS</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <p className="text-gray-600 text-sm">
          View your active orders, including pending and successful activations. For other orders, see History. Use an IP address matching the number&apos;s country for best results. If you get the wrong message, use Retry for another SMS if the number is still active.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Filter by number, country, service"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9 bg-white border-gray-300 text-gray-800 placeholder:text-gray-400 w-full"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm text-gray-600 whitespace-nowrap">Show:</span>
            <Select value={pageSize} onValueChange={setPageSize}>
              <SelectTrigger className="w-full sm:w-20 bg-white border-gray-300 text-gray-800">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="relative overflow-x-auto border border-gray-200 rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-gray-50">
                <TableHead className="text-gray-600">ID</TableHead>
                <TableHead className="text-gray-600">Number</TableHead>
                <TableHead className="text-gray-600">Code</TableHead>
                <TableHead className="text-gray-600">Country</TableHead>
                <TableHead className="text-gray-600">Service</TableHead>
                <TableHead className="text-gray-600">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && activations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <div className="flex items-center justify-center text-gray-600">
                      <ClipLoader size={20} color="#666" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredActivations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-600">
                      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <InfoCircle className="h-6 w-6" />
                      </div>
                      <p>No Activations</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredActivations.slice(0, parseInt(pageSize)).map((activation) => (
                  <TableRow key={activation.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono">{activation.id}</TableCell>
                    <TableCell>{`+${activation.phone}`}</TableCell>
                    <TableCell>{activation.sms_code}</TableCell>
                    <TableCell>{activation.country}</TableCell>
                    <TableCell>{activation.service}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                        ${activation.status === 'active' ? 'bg-green-100 text-green-800' : 
                          activation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-blue-100 text-blue-800'}`}>
                        {activation.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  )
}

