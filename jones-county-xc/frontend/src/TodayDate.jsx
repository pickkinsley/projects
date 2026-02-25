function TodayDate() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return <p className="text-sm text-blue-300/70 mt-5">{today}</p>
}

export default TodayDate
