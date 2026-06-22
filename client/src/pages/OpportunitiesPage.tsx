import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'

export default function OpportunitiesPage() {
  const queryClient = useQueryClient()

  const { data: opportunities } = useQuery({
    queryKey: ['opportunities'],
    queryFn: () => api.opportunities.list(),
  })

  const bookmarkMutation = useMutation({
    mutationFn: ({ id, bookmarked }: { id: string; bookmarked: boolean }) =>
      bookmarked ? api.opportunities.unbookmark(id) : api.opportunities.bookmark(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['opportunities'] }),
  })

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Opportunities</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {opportunities?.map((opp) => (
          <div key={opp._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 space-y-3">
            <div className="flex items-start justify-between">
              <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                {opp.type}
              </span>
              <button onClick={() => bookmarkMutation.mutate({ id: opp._id, bookmarked: opp.bookmarked })}>
                {opp.bookmarked ? '★' : '☆'}
              </button>
            </div>
            <h3 className="font-semibold text-gray-900">{opp.title}</h3>
            <p className="text-sm text-gray-500 line-clamp-2">{opp.description}</p>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Deadline: {new Date(opp.deadline).toLocaleDateString()}</span>
              <a href={opp.url} target="_blank" rel="noopener noreferrer"
                className="text-indigo-600 hover:underline">View</a>
            </div>
          </div>
        ))}
        {!opportunities?.length && <p className="text-sm text-gray-400 col-span-full">No opportunities yet.</p>}
      </div>
    </div>
  )
}
