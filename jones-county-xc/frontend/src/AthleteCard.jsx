function AthleteCard({ name, time }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-5 py-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1.5 hover:border-blue-300">
      <h3 className="text-lg font-bold text-gray-800">{name}</h3>
      <p className="text-sm text-blue-600 font-medium mt-1">⏱️ {time}</p>
      <button className="mt-3 w-full border border-gray-300 rounded-md px-4 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100">
        View Details
      </button>
    </div>
  )
}

export default AthleteCard
