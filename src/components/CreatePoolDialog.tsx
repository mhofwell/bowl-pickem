import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface CreatePoolDialogProps {
  onCreatePool: (name: string) => Promise<unknown>
}

export function CreatePoolDialog({ onCreatePool }: CreatePoolDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setCreating(true)
    const result = await onCreatePool(name.trim())
    setCreating(false)

    if (result) {
      setName('')
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Pool</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a Pool</DialogTitle>
            <DialogDescription>
              Create a new pool and invite friends to compete
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Pool name (e.g., Family Bowl Pool)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={creating}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={creating || !name.trim()}>
              {creating ? 'Creating...' : 'Create Pool'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
