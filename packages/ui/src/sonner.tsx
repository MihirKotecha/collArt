'use client'

import { Toaster, toast } from 'sonner'

export const ErrorToaster = () => {
  return <Toaster richColors />
}

export const errorToast = (message: string) => {
  // Guard to ensure this only runs on the client
  if (typeof window === 'undefined') return
  toast.error(message)
}