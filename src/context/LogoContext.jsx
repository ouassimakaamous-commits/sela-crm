import { createContext, useContext, useState } from 'react'

const LogoContext = createContext(null)

export function LogoProvider({ children }) {
  const [logo, setLogoState] = useState(() => localStorage.getItem('sela_logo') || null)

  const setLogo = (dataUrl) => {
    if (dataUrl) {
      localStorage.setItem('sela_logo', dataUrl)
    } else {
      localStorage.removeItem('sela_logo')
    }
    setLogoState(dataUrl)
  }

  return (
    <LogoContext.Provider value={{ logo, setLogo }}>
      {children}
    </LogoContext.Provider>
  )
}

export const useLogo = () => useContext(LogoContext)
