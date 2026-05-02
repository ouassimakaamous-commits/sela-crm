import TopBar from './TopBar'
import Sidebar from './Sidebar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar />
      <div className="flex-1 ml-16">
        <TopBar />
        <main className="pt-[6.25rem] px-6 pb-8 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
