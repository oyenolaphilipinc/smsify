export interface ActivationResponse {
    activation_id: string
    phone: string
    sms_status: string
    sms_code: string | null
    sms_text: string | null
    activation_status: string
    error?: string
  }
  
  export type PollingStatus = 'idle' | 'polling' | 'received' | 'error'
  
  