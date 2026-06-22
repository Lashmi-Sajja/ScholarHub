import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-500">Name</label>
          <div className="text-gray-900">{user?.name}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">Email</label>
          <div className="text-gray-900">{user?.email}</div>
        </div>
      </div>
    </div>
  )
}
