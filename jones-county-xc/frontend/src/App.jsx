import AthleteList from './AthleteList'
import AthleteCard from './AthleteCard'
import RaceCategorySelect from './RaceCategorySelect'
import TodayDate from './TodayDate'
import UpcomingMeets from './UpcomingMeets'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <div className="relative w-full overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 py-14 text-center">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 22px)' }} />
        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300 mb-3">Jones County High School</p>
          <h1 className="text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-white drop-shadow-lg">Cross Country</h1>
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-purple-400" />
            <p className="text-xl font-bold uppercase tracking-widest text-purple-300 italic">Home of the Vikings</p>
            <div className="h-px w-16 bg-purple-400" />
          </div>
          <TodayDate />
        </div>
      </div>
      <div className="flex flex-col items-center py-10">
        <RaceCategorySelect />
        <AthleteList />
        <div className="mt-10 w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Featured Athletes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AthleteCard name="Marcus Rivera" time="16:15" />
            <AthleteCard name="Jake Thompson" time="16:42" />
            <AthleteCard name="Liam Johnson" time="17:12" />
          </div>
        </div>
        <UpcomingMeets />
      </div>
    </div>
  )
}

export default App
