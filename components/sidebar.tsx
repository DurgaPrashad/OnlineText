"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, Edit, FilePlus, MoreVertical, Trash2 } from "lucide-react"
import type { Note } from "@/types/note"
import { formatDistanceToNow } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface SidebarProps {
  notes: Note[]
  activeNoteId: string
  onNoteSelect: (id: string) => void
  onNoteCreate: () => void
  onNoteDelete: (id: string) => void
  onNoteRename: (id: string, title: string) => void
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({
  notes,
  activeNoteId,
  onNoteSelect,
  onNoteCreate,
  onNoteDelete,
  onNoteRename,
  isOpen,
  onToggle,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [noteToRename, setNoteToRename] = useState<Note | null>(null)
  const [newTitle, setNewTitle] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null)

  const filteredNotes = notes.filter((note) => note.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })

  const handleRenameClick = (note: Note) => {
    setNoteToRename(note)
    setNewTitle(note.title)
    setIsRenameDialogOpen(true)
  }

  const handleRenameConfirm = () => {
    if (noteToRename && newTitle.trim()) {
      onNoteRename(noteToRename.id, newTitle.trim())
      setIsRenameDialogOpen(false)
    }
  }

  const handleDeleteClick = (note: Note) => {
    setNoteToDelete(note)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (noteToDelete) {
      onNoteDelete(noteToDelete.id)
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <>
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-20 w-64 transform border-r bg-background transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? "md:w-64" : "md:w-0"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-xl font-bold">OnlineText</h2>
            <Button variant="ghost" size="icon" onClick={onToggle}>
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9"
              />
              <Button size="icon" variant="outline" onClick={onNoteCreate} title="Create new note">
                <FilePlus className="h-4 w-4" />
                <span className="sr-only">New note</span>
              </Button>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-1 p-2">
              {sortedNotes.length === 0 ? (
                <p className="px-4 py-2 text-sm text-muted-foreground">No notes found</p>
              ) : (
                sortedNotes.map((note) => (
                  <div
                    key={note.id}
                    className={`group flex cursor-pointer items-center justify-between rounded-md px-3 py-2 ${
                      note.id === activeNoteId ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                    }`}
                    onClick={() => onNoteSelect(note.id)}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{note.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleRenameClick(note)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteClick(note)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Note</DialogTitle>
            <DialogDescription>Enter a new name for your note.</DialogDescription>
          </DialogHeader>
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Note title"
            className="mt-4"
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenameConfirm}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{noteToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
