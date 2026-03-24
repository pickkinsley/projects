import { useAuth } from '@/contexts/AuthContext'
import AddAthleteForm from '@/AddAthleteForm'
import AdminAthleteTable from '@/components/AdminAthleteTable'

function AdminPage() {
  const { user } = useAuth()

  return (
    <>
      <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h2>
        <p className="text-gray-600">Welcome back, <span className="font-semibold">{user.username}</span>.</p>
      </div>
      <AdminAthleteTable />
      <AddAthleteForm />
    </>
  )
}

export default AdminPage
