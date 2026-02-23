const placeholderMeets = [
  { id: 1, name: 'Jones County Invitational', date: 'September 5, 2026', location: 'Jones County Park' },
  { id: 2, name: 'Region 4 Championship', date: 'September 19, 2026', location: 'Cedar Creek Trail' },
  { id: 3, name: 'Peach State Classic', date: 'October 3, 2026', location: 'Peach State Fields' },
  { id: 4, name: 'State Finals', date: 'October 24, 2026', location: 'Carrollton, GA' },
]

function UpcomingMeets() {
  return (
    <div className="mt-10 w-full max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Meets</h2>
      <div className="flex flex-col gap-3">
        {placeholderMeets.map((meet) => (
          <div key={meet.id} className="bg-white rounded shadow px-5 py-4">
            <h3 className="font-semibold text-gray-800">{meet.name}</h3>
            <p className="text-sm text-gray-500 mt-1">📅 {meet.date} &middot; {meet.location}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UpcomingMeets
