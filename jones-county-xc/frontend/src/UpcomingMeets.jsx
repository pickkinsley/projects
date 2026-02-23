const placeholderMeets = [
  { id: 1, name: 'Jones County Invitational', date: 'September 5, 2026', location: 'Jones County Park' },
  { id: 2, name: 'Region 4 Championship', date: 'September 19, 2026', location: 'Cedar Creek Trail' },
  { id: 3, name: 'Peach State Classic', date: 'October 3, 2026', location: 'Peach State Fields' },
  { id: 4, name: 'State Finals', date: 'October 24, 2026', location: 'Carrollton, GA' },
]

function getDaysAway(dateStr) {
  const meetDate = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const days = Math.ceil((meetDate - today) / (1000 * 60 * 60 * 24))
  if (days < 0) return 'Past'
  if (days === 0) return 'Today!'
  if (days === 1) return 'Tomorrow'
  if (days <= 14) return `${days} days away`
  const weeks = Math.floor(days / 7)
  return `In ${weeks} week${weeks > 1 ? 's' : ''}`
}

function getMonthColor(date) {
  if (date.startsWith('September')) return 'bg-blue-50'
  if (date.startsWith('October')) return 'bg-orange-50'
  return 'bg-white'
}

function UpcomingMeets() {
  return (
    <div className="mt-10 w-full max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Meets</h2>
      <div className="flex flex-col gap-3">
        {placeholderMeets.map((meet) => (
          <div key={meet.id} className={`${getMonthColor(meet.date)} rounded shadow px-5 py-4 flex justify-between items-center`}>
            <div>
              <h3 className="font-semibold text-gray-800">{meet.name}</h3>
              <p className="text-sm text-gray-500 mt-1">📅 {meet.date} &middot; {meet.location}</p>
            </div>
            <span className="text-xs font-semibold text-purple-700 bg-purple-100 px-3 py-1 rounded-full whitespace-nowrap">
              {getDaysAway(meet.date)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UpcomingMeets
