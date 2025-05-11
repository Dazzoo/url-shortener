interface TopItem {
  [key: string]: string | null | number
  count: number
}

interface TopItemsListProps {
  title: string
  items: TopItem[]
  itemKey: string
}

export function TopItemsList({ title, items, itemKey }: TopItemsListProps) {
  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {item[itemKey] || 'Unknown'}
            </span>
            <span className="text-sm font-medium text-gray-900">
              {item.count} clicks
            </span>
          </div>
        ))}
      </div>
    </div>
  )
} 