'use client'

import { AuthProvider } from '../context/AuthContext'
import { useEffect, useState } from 'react'

export default function ClientAuthProvider({ children }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // During SSR or before mount, render children without AuthProvider
  if (!mounted) {
    return <>{children}</>
  }

  return <AuthProvider>{children}</AuthProvider>
}
