import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

function EditAthleteDialog({ athlete, open, onOpenChange }) {
  const [errors, setErrors] = useState({})
  const queryClient = useQueryClient()

  const [name, setName] = useState('')
  const [grade, setGrade] = useState('')
  const [pr, setPr] = useState('')

  useEffect(() => {
    if (athlete && open) {
      setName(athlete.name)
      setGrade(String(athlete.grade))
      setPr(athlete.personalRecord || '')
      setErrors({})
    }
  }, [athlete, open])

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch(`/api/athletes/${athlete.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Failed to update athlete')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athletes'] })
      onOpenChange(false)
    },
  })

  function handleSubmit(e) {
    e.preventDefault()
    const trimmedName = name.trim()
    const gradeNum = parseInt(grade, 10)
    const trimmedPr = pr.trim()

    const newErrors = {}
    if (!trimmedName) newErrors.name = 'Name is required'
    if (!gradeNum || gradeNum < 9 || gradeNum > 12) newErrors.grade = 'Grade must be 9-12'
    if (!trimmedPr) newErrors.pr = 'Personal record is required'

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    mutation.mutate({ name: trimmedName, grade: gradeNum, personalRecord: trimmedPr })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Athlete</DialogTitle>
          <DialogDescription>Update the athlete's information.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mutation.isError && (
            <p role="alert" className="text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {mutation.error.message}
            </p>
          )}

          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              id="edit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={errors.name ? 'true' : undefined}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.name && <p role="alert" className="text-sm text-red-600 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="edit-grade" className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
            <input
              id="edit-grade"
              type="number"
              min={9}
              max={12}
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              aria-invalid={errors.grade ? 'true' : undefined}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.grade && <p role="alert" className="text-sm text-red-600 mt-1">{errors.grade}</p>}
          </div>

          <div>
            <label htmlFor="edit-pr" className="block text-sm font-medium text-gray-700 mb-1">Personal Record</label>
            <input
              id="edit-pr"
              type="text"
              value={pr}
              onChange={(e) => setPr(e.target.value)}
              aria-invalid={errors.pr ? 'true' : undefined}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.pr && <p role="alert" className="text-sm text-red-600 mt-1">{errors.pr}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditAthleteDialog
