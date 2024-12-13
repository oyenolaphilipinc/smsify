import axios from 'axios'
import { ActivationResponse } from "./types"

const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '13586878e3944331a7158fbe936c6d41'
const BASE_URL = 'https://temp-number-api.com/test/api/v1'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': API_KEY
  }
})

export async function getActivationStatus(activationId: string): Promise<ActivationResponse> {
  try {
    const response = await api.get(`/activation/${activationId}`)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Activation not found. Please check activation history.')
      } else if (error.response?.status === 429) {
        throw new Error('Too many requests. Please try again later.')
      }
      throw new Error('An unexpected error occurred. Please try again.')
    }
    throw error
  }
}

export async function pollForSMS(activationId: string, onUpdate: (data: ActivationResponse) => void, onError: (error: Error) => void) {
  const pollInterval = 5000 // Poll every 5 seconds
  const maxAttempts = 60 // Poll for up to 5 minutes (60 * 5 seconds)
  let attempts = 0

  const poll = async () => {
    try {
      const data = await getActivationStatus(activationId)
      onUpdate(data)

      if (data.sms_code && data.sms_text) {
        // SMS received, stop polling
        return
      }

      attempts++
      if (attempts < maxAttempts) {
        setTimeout(poll, pollInterval)
      } else {
        onError(new Error('Polling timed out. SMS not received.'))
      }
    } catch (error) {
      onError(error instanceof Error ? error : new Error('An unexpected error occurred'))
    }
  }

  poll()
}

