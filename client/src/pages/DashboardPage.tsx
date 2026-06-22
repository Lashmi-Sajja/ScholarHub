import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'

export default function DashboardPage() {
  const { data: stats } = useQuery({ queryKey: ['dashboard'], queryFn: () => api.dashboard.stats() })
  const { data: plans } = useQuery({ queryKey: ['plans'], queryFn: () => api.plans.list() })

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500">Upcoming Tasks</div>
          <div className="text-3xl font-bold text-gray-900 mt-1">{stats?.upcomingTasks ?? 0}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500">Plans Created</div>
          <div className="text-3xl font-bold text-gray-900 mt-1">{stats?.plansCreated ?? 0}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500">Tasks Completed</div>
          <div className="text-3xl font-bold text-gray-900 mt-1">{stats?.tasksCompleted ?? 0}</div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Study Plans</h2>
        {plans?.length ? (
          <ul className="space-y-3">
            {plans.map((plan) => (
              <li key={plan._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-700">{plan.title}</span>
                <span className="text-xs text-gray-400">{new Date(plan.generatedAt).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">No study plans yet.</p>
        )}
      </div>
    </div>
  )
}
