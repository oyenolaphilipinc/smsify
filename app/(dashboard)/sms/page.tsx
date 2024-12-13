'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { getActivationStatus, pollForSMS } from "./api"
import type { ActivationResponse, PollingStatus } from "./types"

export default function SMSVerificationForm() {
  const [phone, setPhone] = useState('')
  const [activationId, setActivationId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ActivationResponse | null>(null)
  const [pollingStatus, setPollingStatus] = useState<PollingStatus>('idle')

  useEffect(() => {
    if (result && result.sms_status === 'smsRequested' && pollingStatus === 'idle') {
      setPollingStatus('polling')
      pollForSMS(
        result.activation_id,
        (data) => {
          setResult(data)
          if (data.sms_code && data.sms_text) {
            setPollingStatus('received')
          }
        },
        (error) => {
          setError(error.message)
          setPollingStatus('error')
        }
      )
    }
  }, [result, pollingStatus])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setPollingStatus('idle')
    
    try {
      const data = await getActivationStatus(activationId)
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-4 flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>SMS Verification</CardTitle>
          <CardDescription>Enter your phone number and activation ID to get the SMS code</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="activationId" className="text-sm font-medium">
                Activation ID
              </label>
              <Input
                id="activationId"
                placeholder="Enter activation ID"
                value={activationId}
                onChange={(e) => setActivationId(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading || pollingStatus === 'polling'}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : pollingStatus === 'polling' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Waiting for SMS...
                </>
              ) : (
                'Check Status'
              )}
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="mt-4 space-y-4">
              <Alert variant={result.sms_code ? 'default' : 'destructive'}>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Status: {result.sms_status}
                </AlertDescription>
              </Alert>
              
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="font-medium">SMS Code:</p>
                {pollingStatus === 'polling' ? (
                  <div className="flex items-center space-x-2 mt-1">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Waiting for SMS...</span>
                  </div>
                ) : (
                  <p className="text-2xl font-mono mt-1">{result.sms_code || 'N/A'}</p>
                )}
                
                <p className="font-medium mt-4">Message:</p>
                {pollingStatus === 'polling' ? (
                  <div className="flex items-center space-x-2 mt-1">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Waiting for SMS...</span>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{result.sms_text || 'N/A'}</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

