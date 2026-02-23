function TodayDate() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return <p className="text-sm text-slate-400 mt-3">{today}</p>
}

export default TodayDate
