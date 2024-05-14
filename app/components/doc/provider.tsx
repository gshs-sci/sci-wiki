'use client'
 
import { createContext } from 'react'
 
export const CurrentActive = createContext({})
 
export default function CurrentActiveProvider({
  children,
  value
}: {
  children: React.ReactNode,
  value:any
}
) {
  return <CurrentActive.Provider value={value}>{children}</CurrentActive.Provider>
}