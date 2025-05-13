"use client"

import { useState, useEffect } from "react"
import { Editor } from "@/components/editor"
import { ThemeProvider } from "@/components/theme-provider"
import type { Note } from "@/types/note"
import { v4 as uuidv4 } from "uuid"
import { TopNavbar } from "@/components/top-navbar"
import { BottomToolbar } from "@/components/bottom-toolbar"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// Use session storage instead of local storage for temporary data
function useSessionStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue
    }

    try {
      // Get from session storage by key
      const item = window.sessionStorage.getItem(key)
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that
  // persists the new value to sessionStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      // Save state
      setStoredValue(valueToStore)
      // Save to session storage
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}

export function NotepadApp() {
  const [notes, setNotes] = useSessionStorage<Note[]>("onlinetext-notes", [])
  const [activeNoteId, setActiveNoteId] = useSessionStorage<string>("onlinetext-active-note", "")
  const [isNewNoteDialogOpen, setIsNewNoteDialogOpen] = useState(false)
  const [newNoteName, setNewNoteName] = useState("")

  // Create a default note if no notes exist
  useEffect(() => {
    if (notes.length === 0) {
      const defaultNote = {
        id: uuidv4(),
        title: "Untitled Note",
        content: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setNotes([defaultNote])
      setActiveNoteId(defaultNote.id)
    } else if (!activeNoteId && notes.length > 0) {
      setActiveNoteId(notes[0].id)
    }
  }, [notes.length, activeNoteId, setNotes, setActiveNoteId])

  const activeNote = notes.find((note) => note.id === activeNoteId) || notes[0]

  const handleNoteChange = (content: string) => {
    if (!activeNote) return

    const updatedNotes = notes.map((note) => {
      if (note.id === activeNote.id) {
        return {
          ...note,
          content,
          updatedAt: new Date().toISOString(),
        }
      }
      return note
    })

    setNotes(updatedNotes)
  }

  const handleCreateNewNote = () => {
    setNewNoteName("")
    setIsNewNoteDialogOpen(true)
  }

  const handleNewNoteConfirm = () => {
    const title = newNoteName.trim() || `Untitled Note ${notes.length + 1}`

    const newNote = {
      id: uuidv4(),
      title,
      content: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setNotes([...notes, newNote])
    setActiveNoteId(newNote.id)
    setIsNewNoteDialogOpen(false)
  }

  const handleNoteDelete = (id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id)

    if (updatedNotes.length === 0) {
      // If deleting the last note, create a new empty one
      const defaultNote = {
        id: uuidv4(),
        title: "Untitled Note",
        content: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setNotes([defaultNote])
      setActiveNoteId(defaultNote.id)
    } else {
      setNotes(updatedNotes)
      if (activeNoteId === id) {
        setActiveNoteId(updatedNotes[0].id)
      }
    }
  }

  const handleNoteSelect = (id: string) => {
    setActiveNoteId(id)
  }

  const handleNoteRename = (id: string, title: string) => {
    const updatedNotes = notes.map((note) => {
      if (note.id === id) {
        return {
          ...note,
          title,
          updatedAt: new Date().toISOString(),
        }
      }
      return note
    })

    setNotes(updatedNotes)
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div className="flex flex-col h-screen w-full overflow-hidden bg-background">
        <TopNavbar
          notes={notes}
          activeNoteId={activeNoteId}
          onNoteSelect={handleNoteSelect}
          onCreateNewNote={handleCreateNewNote}
          onNoteDelete={handleNoteDelete}
          onNoteRename={handleNoteRename}
        />

        {activeNote && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <Editor note={activeNote} onChange={handleNoteChange} />
          </div>
        )}

        <BottomToolbar activeNote={activeNote} />
      </div>

      {/* New Note Dialog */}
      <Dialog open={isNewNoteDialogOpen} onOpenChange={setIsNewNoteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Note</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newNoteName}
              onChange={(e) => setNewNoteName(e.target.value)}
              placeholder="Enter note name"
              className="w-full"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleNewNoteConfirm()
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewNoteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleNewNoteConfirm}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  )
}
