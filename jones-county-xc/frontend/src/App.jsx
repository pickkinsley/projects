import AthleteList from './AthleteList'
import AthleteCard from './AthleteCard'
import RaceCategorySelect from './RaceCategorySelect'
import TodayDate from './TodayDate'
import UpcomingMeets from './UpcomingMeets'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <div className="w-full bg-blue-100 py-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Welcome to Jones County Cross Country</h1>
        <p className="text-lg text-blue-500 mt-2">Home of the Vikings</p>
        <TodayDate />
      </div>
      <div className="flex flex-col items-center py-10">
        <RaceCategorySelect />
        <AthleteList />
        <div className="mt-10 w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Featured Athletes</h2>
          <div className="grid grid-cols-3 gap-4">
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
