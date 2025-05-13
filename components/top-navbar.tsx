"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { FilePlus, X } from "lucide-react"
import type { Note } from "@/types/note"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface TopNavbarProps {
  notes: Note[]
  activeNoteId: string
  onNoteSelect: (id: string) => void
  onCreateNewNote: () => void
  onNoteDelete: (id: string) => void
  onNoteRename: (id: string, title: string) => void
}

export function TopNavbar({
  notes,
  activeNoteId,
  onNoteSelect,
  onCreateNewNote,
  onNoteDelete,
  onNoteRename,
}: TopNavbarProps) {
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingNoteId && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingNoteId])

  const handleDoubleClick = (note: Note, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingNoteId(note.id)
    setEditingTitle(note.title)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(e.target.value)
  }

  const handleTitleBlur = () => {
    if (editingNoteId && editingTitle.trim()) {
      onNoteRename(editingNoteId, editingTitle.trim())
    }
    setEditingNoteId(null)
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && editingNoteId && editingTitle.trim()) {
      onNoteRename(editingNoteId, editingTitle.trim())
      setEditingNoteId(null)
    } else if (e.key === "Escape") {
      setEditingNoteId(null)
    }
  }

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onNoteDelete(id)
  }

  return (
    <div className="bg-background h-10 flex items-center">
      <div className="flex items-center h-full">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-none"
          onClick={onCreateNewNote}
          title="Create new note"
        >
          <FilePlus className="h-4 w-4" />
          <span className="sr-only">New note</span>
        </Button>
      </div>

      <ScrollArea className="flex-1 h-full" orientation="horizontal">
        <div className="flex items-center h-full">
          {notes.map((note) => (
            <div
              key={note.id}
              className={cn(
                "h-full flex items-center px-3 cursor-pointer group relative w-[120px]",
                note.id === activeNoteId ? "bg-accent text-accent-foreground" : "hover:bg-muted",
              )}
              onClick={() => onNoteSelect(note.id)}
              onDoubleClick={(e) => handleDoubleClick(note, e)}
            >
              {editingNoteId === note.id ? (
                <Input
                  ref={inputRef}
                  value={editingTitle}
                  onChange={handleTitleChange}
                  onBlur={handleTitleBlur}
                  onKeyDown={handleTitleKeyDown}
                  className="h-6 p-1 w-full"
                />
              ) : (
                <span className="truncate w-full" title={note.title}>
                  {note.title}
                </span>
              )}

              {note.id !== editingNoteId && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 absolute right-1 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                  onClick={(e) => handleDeleteClick(note.id, e)}
                  title="Delete note"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Delete</span>
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div>
        <ThemeToggle />
      </div>
    </div>
  )
}
