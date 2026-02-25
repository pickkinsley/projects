import { useQuery } from '@tanstack/react-query'

function AthleteList() {
  const { data: athletes, isLoading, error } = useQuery({
    queryKey: ['athletes'],
    queryFn: async () => {
      const res = await fetch('/api/athletes')
      if (!res.ok) throw new Error('Failed to fetch athletes')
      return res.json()
    },
  })

  if (isLoading) return <p className="text-gray-600">Loading athletes...</p>
  if (error) return <p className="text-red-600">Error: {error.message}</p>

  return (
    <div className="mt-6 w-full max-w-2xl">
      <h2 className="text-2xl font-extrabold uppercase tracking-wide text-gray-800 mb-4">Team Roster</h2>
      <div className="overflow-hidden rounded-lg shadow-lg border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-blue-900 to-purple-900 text-white text-left uppercase text-sm tracking-wider">
              <th className="px-5 py-3 font-semibold">Athlete</th>
              <th className="px-5 py-3 font-semibold">Grade</th>
              <th className="px-5 py-3 font-semibold">Personal Record</th>
            </tr>
          </thead>
          <tbody>
            {athletes.map((athlete, index) => (
              <tr key={athlete.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/50'} transition-colors hover:bg-purple-100 cursor-pointer`}>
                <td className="px-5 py-3 font-bold text-gray-900">{athlete.name}</td>
                <td className="px-5 py-3 text-gray-600">{athlete.grade}</td>
                <td className="px-5 py-3">
                  <span className="font-semibold text-blue-700">{athlete.personalRecord}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AthleteList
