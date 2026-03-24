import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import EditAthleteDialog from '@/components/EditAthleteDialog'
import DeleteAthleteDialog from '@/components/DeleteAthleteDialog'

function SkeletonRow({ even }) {
  return (
    <tr className={even ? 'bg-white' : 'bg-blue-50/50'}>
      <td className="px-5 py-3"><div className="h-4 w-32 rounded bg-gray-200 animate-pulse" /></td>
      <td className="px-5 py-3"><div className="h-4 w-10 rounded bg-gray-200 animate-pulse" /></td>
      <td className="px-5 py-3"><div className="h-4 w-16 rounded bg-gray-200 animate-pulse" /></td>
      <td className="px-5 py-3"><div className="h-4 w-24 rounded bg-gray-200 animate-pulse" /></td>
    </tr>
  )
}

function AdminAthleteTable() {
  const [editAthlete, setEditAthlete] = useState(null)
  const [deleteAthlete, setDeleteAthlete] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')

  const { data: athletes, isLoading, error } = useQuery({
    queryKey: ['athletes'],
    queryFn: async () => {
      const res = await fetch('/api/athletes')
      if (!res.ok) throw new Error('Failed to fetch athletes')
      return res.json()
    },
  })

  function handleEditSuccess() {
    setEditAthlete(null)
    setSuccessMsg('Athlete updated successfully!')
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  function handleDeleteSuccess() {
    setDeleteAthlete(null)
    setSuccessMsg('Athlete deleted successfully!')
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  if (error) return <p className="text-red-600">Error: {error.message}</p>

  return (
    <div className="w-full max-w-2xl">
      <h2 className="text-2xl font-extrabold uppercase tracking-wide text-gray-800 mb-4">Manage Athletes</h2>

      {successMsg && (
        <p role="alert" className="text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-md px-3 py-2 mb-4">
          {successMsg}
        </p>
      )}

      <div className="overflow-hidden rounded-lg shadow-lg border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-blue-900 to-purple-900 text-white text-left uppercase text-sm tracking-wider">
              <th className="px-5 py-3 font-semibold">Athlete</th>
              <th className="px-5 py-3 font-semibold">Grade</th>
              <th className="px-5 py-3 font-semibold">Personal Record</th>
              <th className="px-5 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }, (_, i) => (
                  <SkeletonRow key={i} even={i % 2 === 0} />
                ))
              : athletes.map((athlete, index) => (
                  <tr
                    key={athlete.id}
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/50'} transition-colors hover:bg-purple-100`}
                    style={{ animation: 'fade-in 350ms ease-out' }}
                  >
                    <td className="px-5 py-3 font-bold text-gray-900">{athlete.name}</td>
                    <td className="px-5 py-3 text-gray-600">{athlete.grade}</td>
                    <td className="px-5 py-3">
                      <span className="font-semibold text-blue-700">{athlete.personalRecord}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditAthlete(athlete)}>
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => setDeleteAthlete(athlete)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {editAthlete && (
        <EditAthleteDialog
          athlete={editAthlete}
          open={!!editAthlete}
          onOpenChange={(open) => {
            if (!open) handleEditSuccess()
          }}
        />
      )}

      {deleteAthlete && (
        <DeleteAthleteDialog
          athlete={deleteAthlete}
          open={!!deleteAthlete}
          onOpenChange={(open) => {
            if (!open) handleDeleteSuccess()
          }}
        />
      )}
    </div>
  )
}

export default AdminAthleteTable
