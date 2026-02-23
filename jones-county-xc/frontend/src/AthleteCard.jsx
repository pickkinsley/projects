function AthleteCard({ name, time }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-5 py-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1.5 hover:border-blue-300">
      <h3 className="text-lg font-bold text-gray-800">{name}</h3>
      <p className="text-sm text-blue-600 font-medium mt-1">⏱️ {time}</p>
    </div>
  )
}

export default AthleteCard
