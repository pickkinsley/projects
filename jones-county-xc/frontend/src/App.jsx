import AthleteList from './AthleteList'
import TodayDate from './TodayDate'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <div className="w-full bg-slate-800 py-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Welcome to Jones County Cross Country</h1>
        <p className="text-lg text-slate-300 mt-2">Home of the Vikings</p>
        <TodayDate />
      </div>
      <div className="flex flex-col items-center py-10">
        <AthleteList />
      </div>
    </div>
  )
}

export default App
