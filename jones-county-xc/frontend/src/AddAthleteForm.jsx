import { useState } from 'react'
import { Button } from '@/components/ui/button'

function AddAthleteForm() {
  const [errors, setErrors] = useState({})

  function handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    const name = form.name.value.trim()
    const grade = form.grade.value
    const pr = form.pr.value.trim()

    const newErrors = {}
    if (!name) newErrors.name = 'Name is required'
    if (!grade || grade < 9 || grade > 12) newErrors.grade = 'Grade must be 9-12'
    if (!pr) newErrors.pr = 'Personal record is required'

    setErrors(newErrors)
  }

  return (
    <div className="mt-10 w-full max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Athlete</h2>
      <form onSubmit={handleSubmit} noValidate className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col gap-5">
        <div>
          <label htmlFor="athlete-name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            id="athlete-name"
            name="name"
            type="text"
            placeholder="e.g. Jake Thompson"
            aria-describedby={errors.name ? 'name-error' : undefined}
            aria-invalid={errors.name ? 'true' : undefined}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.name && (
            <p id="name-error" role="alert" className="text-sm text-red-600 mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="athlete-grade" className="block text-sm font-medium text-gray-700 mb-1">
            Grade
          </label>
          <input
            id="athlete-grade"
            name="grade"
            type="number"
            min={9}
            max={12}
            placeholder="9-12"
            aria-describedby={errors.grade ? 'grade-error' : undefined}
            aria-invalid={errors.grade ? 'true' : undefined}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.grade && (
            <p id="grade-error" role="alert" className="text-sm text-red-600 mt-1">{errors.grade}</p>
          )}
        </div>

        <div>
          <label htmlFor="athlete-pr" className="block text-sm font-medium text-gray-700 mb-1">
            Personal Record
          </label>
          <input
            id="athlete-pr"
            name="pr"
            type="text"
            placeholder="e.g. 16:42"
            aria-describedby={errors.pr ? 'pr-error' : undefined}
            aria-invalid={errors.pr ? 'true' : undefined}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.pr && (
            <p id="pr-error" role="alert" className="text-sm text-red-600 mt-1">{errors.pr}</p>
          )}
        </div>

        <Button type="submit" className="w-full">
          Add Athlete
        </Button>
      </form>
    </div>
  )
}

export default AddAthleteForm
