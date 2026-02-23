import { useState } from 'react'

const categories = ['5K', '3200m', '1600m', '800m']

function RaceCategorySelect() {
  const [selected, setSelected] = useState('')

  return (
    <div className="w-full max-w-xs">
      <label className="block text-sm font-medium text-gray-700 mb-1">Race Category</label>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white transition-colors hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Select a category</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  )
}

export default RaceCategorySelect
