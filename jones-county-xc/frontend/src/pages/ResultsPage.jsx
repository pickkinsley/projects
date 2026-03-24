import { useQuery } from '@tanstack/react-query'

function SkeletonRow({ even }) {
  return (
    <tr className={even ? 'bg-white' : 'bg-blue-50/50'}>
      <td className="px-5 py-3"><div className="h-4 w-28 rounded bg-gray-200 animate-pulse" /></td>
      <td className="px-5 py-3"><div className="h-4 w-16 rounded bg-gray-200 animate-pulse" /></td>
      <td className="px-5 py-3"><div className="h-4 w-20 rounded bg-gray-200 animate-pulse" /></td>
    </tr>
  )
}

function ResultsTable({ title, queryKey, endpoint, columns }) {
  const { data: results, isLoading, error } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const res = await fetch(endpoint)
      if (!res.ok) throw new Error(`Failed to fetch ${title.toLowerCase()}`)
      return res.json()
    },
  })

  return (
    <div className="w-full max-w-2xl">
      <h2 className="text-2xl font-extrabold uppercase tracking-wide text-gray-800 mb-4">{title}</h2>
      {error ? (
        <p className="text-red-600">Error: {error.message}</p>
      ) : (
        <div className="overflow-hidden rounded-lg shadow-lg border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-900 to-purple-900 text-white text-left uppercase text-sm tracking-wider">
                {columns.map((col) => (
                  <th key={col.key} className="px-5 py-3 font-semibold">{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }, (_, i) => (
                    <SkeletonRow key={i} even={i % 2 === 0} />
                  ))
                : results.map((row, index) => (
                    <tr
                      key={row.id ?? index}
                      className={`${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/50'} transition-colors hover:bg-purple-100`}
                      style={{ animation: 'fade-in 350ms ease-out' }}
                    >
                      {columns.map((col) => (
                        <td key={col.key} className={`px-5 py-3 ${col.className ?? 'text-gray-600'}`}>
                          {row[col.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const fastestColumns = [
  { key: 'name', label: 'Athlete', className: 'font-bold text-gray-900' },
  { key: 'time', label: 'Time', className: 'font-semibold text-blue-700' },
  { key: 'meet', label: 'Meet' },
]

const latestColumns = [
  { key: 'name', label: 'Athlete', className: 'font-bold text-gray-900' },
  { key: 'time', label: 'Time', className: 'font-semibold text-blue-700' },
  { key: 'date', label: 'Date' },
]

function ResultsPage() {
  return (
    <>
      <ResultsTable
        title="Fastest Times"
        queryKey="results-fastest"
        endpoint="/api/results/fastest"
        columns={fastestColumns}
      />
      <div className="mt-10 w-full max-w-2xl">
        <ResultsTable
          title="Latest Results"
          queryKey="results-latest"
          endpoint="/api/results/latest"
          columns={latestColumns}
        />
      </div>
    </>
  )
}

export default ResultsPage
