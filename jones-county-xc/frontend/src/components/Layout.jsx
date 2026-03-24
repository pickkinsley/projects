import { Outlet } from 'react-router'
import TodayDate from '@/TodayDate'
import Navigation from '@/components/Navigation'

function Layout() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="relative w-full overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 py-14 text-center">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 22px)' }} />
        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300 mb-3">Jones County High School</p>
          <h1 className="text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-white drop-shadow-lg">Cross Country</h1>
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-purple-400" aria-hidden="true" />
            <p className="text-xl font-bold uppercase tracking-widest text-purple-300 italic">Home of the Vikings</p>
            <div className="h-px w-16 bg-purple-400" aria-hidden="true" />
          </div>
          <TodayDate />
        </div>
      </header>
      <Navigation />
      <main className="flex-1 flex flex-col items-center py-10">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
