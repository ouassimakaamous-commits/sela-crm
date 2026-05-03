import { useState } from 'react'
import TopBar from './TopBar'
import Sidebar from './Sidebar'

export default function Layout({ children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {/* Mobile overlay */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <div className="flex-1 md:ml-16">
        <TopBar onMenuToggle={() => setMobileNavOpen((o) => !o)} />
        <main className="pt-[6.25rem] px-4 md:px-6 pb-8 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
