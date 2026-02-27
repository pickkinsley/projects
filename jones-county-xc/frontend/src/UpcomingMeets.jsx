import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'

function getDaysAway(dateStr) {
  const meetDate = new Date(dateStr + 'T00:00:00')
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

function getMonthColor(dateStr) {
  const month = new Date(dateStr + 'T00:00:00').getMonth()
  if (month === 8) return 'bg-blue-50'   // September
  if (month === 9) return 'bg-orange-50' // October
  return 'bg-white'
}

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function UpcomingMeets() {
  const { data: meets, isLoading, error, refetch } = useQuery({
    queryKey: ['meets'],
    queryFn: async () => {
      const res = await fetch('/api/meets')
      if (!res.ok) throw new Error('Failed to fetch meets')
      return res.json()
    },
  })

  if (isLoading) return (
    <div className="mt-10 w-full max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Meets</h2>
      <p className="text-gray-600">Loading meets...</p>
    </div>
  )

  if (error) return (
    <div className="mt-10 w-full max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Meets</h2>
      <div className="bg-white rounded shadow px-5 py-4 flex items-center justify-between">
        <p className="text-red-600">Error: {error.message}</p>
        <Button variant="outline" onClick={() => refetch()}>Retry</Button>
      </div>
    </div>
  )

  return (
    <div className="mt-10 w-full max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Meets</h2>
      <div className="flex flex-col gap-3">
        {meets.map((meet) => (
          <div key={meet.id} className={`${getMonthColor(meet.date)} rounded shadow px-5 py-4 flex justify-between items-center`}>
            <div>
              <h3 className="font-semibold text-gray-800">{meet.name}</h3>
              <p className="text-sm text-gray-500 mt-1"><span aria-hidden="true">📅 </span>{formatDate(meet.date)} &middot; {meet.location}</p>
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
