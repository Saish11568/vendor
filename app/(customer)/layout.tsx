"use client"

import { StoreProvider } from '@/components/store-provider'

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <StoreProvider>
      {children}
    </StoreProvider>
  )
}
