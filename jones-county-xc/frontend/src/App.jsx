import AthleteList from './AthleteList'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-800">Hello World!</h1>
      <p className="text-2xl text-gray-600 mt-2">Jones County XC</p>
      <AthleteList />
    </div>
  )
}

export default App
