import RaceCategorySelect from '@/RaceCategorySelect'
import AthleteCard from '@/AthleteCard'

function HomePage() {
  return (
    <>
      <RaceCategorySelect />
      <div className="mt-10 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Featured Athletes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AthleteCard name="Marcus Rivera" time="16:15" />
          <AthleteCard name="Jake Thompson" time="16:42" />
          <AthleteCard name="Liam Johnson" time="17:12" />
        </div>
      </div>
    </>
  )
}

export default HomePage
