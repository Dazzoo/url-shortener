interface AnalyticsOverviewProps {
  clicks: number
  lastClicked: string | null
}

export function AnalyticsOverview({ clicks, lastClicked }: AnalyticsOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-xl p-6">
        <h3 className="text-sm font-medium text-gray-500">Total Clicks</h3>
        <p className="mt-2 text-3xl font-semibold text-gray-900">{clicks}</p>
      </div>
      <div className="bg-white rounded-lg shadow-xl p-6">
        <h3 className="text-sm font-medium text-gray-500">Last Clicked</h3>
        <p className="mt-2 text-3xl font-semibold text-gray-900">
          {lastClicked ? new Date(lastClicked).toLocaleDateString() : 'Never'}
        </p>
      </div>
    </div>
  )
} 