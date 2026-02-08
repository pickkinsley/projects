import { useQuery } from '@tanstack/react-query'

function AthleteList() {
  const { data: athletes, isLoading, error } = useQuery({
    queryKey: ['athletes'],
    queryFn: async () => {
      const res = await fetch('http://localhost:8080/api/athletes')
      if (!res.ok) throw new Error('Failed to fetch athletes')
      return res.json()
    },
  })

  if (isLoading) return <p className="text-gray-600">Loading athletes...</p>
  if (error) return <p className="text-red-600">Error: {error.message}</p>

  return (
    <div className="mt-6 w-full max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Athletes</h2>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Grade</th>
            <th className="px-4 py-2">PR</th>
          </tr>
        </thead>
        <tbody>
          {athletes.map((athlete) => (
            <tr key={athlete.id} className="border-t">
              <td className="px-4 py-2">{athlete.name}</td>
              <td className="px-4 py-2">{athlete.grade}</td>
              <td className="px-4 py-2">{athlete.personalRecord}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AthleteList
