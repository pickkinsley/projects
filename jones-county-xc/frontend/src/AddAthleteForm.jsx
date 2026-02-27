import { useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'

function AddAthleteForm() {
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const formRef = useRef(null)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (athlete) => {
      const res = await fetch('/api/athletes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(athlete),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Failed to add athlete')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athletes'] })
      formRef.current.reset()
      setErrors({})
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    },
  })

  function handleSubmit(e) {
    e.preventDefault()
    setSuccess(false)
    const form = e.target
    const name = form.name.value.trim()
    const grade = parseInt(form.grade.value, 10)
    const pr = form.pr.value.trim()

    const newErrors = {}
    if (!name) newErrors.name = 'Name is required'
    if (!grade || grade < 9 || grade > 12) newErrors.grade = 'Grade must be 9-12'
    if (!pr) newErrors.pr = 'Personal record is required'

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    mutation.mutate({ name, grade, personalRecord: pr })
  }

  return (
    <div className="mt-10 w-full max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Athlete</h2>
      <form ref={formRef} onSubmit={handleSubmit} noValidate className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col gap-5">
        {success && (
          <p role="alert" className="text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-md px-3 py-2">
            Athlete added successfully!
          </p>
        )}
        {mutation.isError && (
          <p role="alert" className="text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {mutation.error.message}
          </p>
        )}

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

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? 'Adding...' : 'Add Athlete'}
        </Button>
      </form>
    </div>
  )
}

export default AddAthleteForm
