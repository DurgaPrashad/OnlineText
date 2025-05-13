"use client"

import { useState, useEffect, useRef } from "react"
import type { Note } from "@/types/note"
import { useDebounce } from "@/hooks/use-debounce"
import { Loader2 } from "lucide-react"
import { RichTextEditor } from "@/components/rich-text-editor"

interface EditorProps {
  note: Note
  onChange: (content: string) => void
}

export function Editor({ note, onChange }: EditorProps) {
  const [content, setContent] = useState(note.content)
  const [isSaving, setIsSaving] = useState(false)
  const debouncedContent = useDebounce(content, 500) // Reduced debounce time for quicker saves
  const editorRef = useRef<HTMLDivElement>(null)

  // Update content when note changes
  useEffect(() => {
    setContent(note.content)
  }, [note.id, note.content])

  // Auto-save content
  useEffect(() => {
    if (debouncedContent !== note.content) {
      setIsSaving(true)
      onChange(debouncedContent)

      // Simulate saving delay
      const timer = setTimeout(() => {
        setIsSaving(false)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [debouncedContent, note.content, onChange])

  // Auto-focus editor
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus()
    }
  }, [note.id])

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="relative flex flex-1 flex-col overflow-auto">
        <div className="flex-1 p-4 mx-auto w-full max-w-4xl">
          <RichTextEditor ref={editorRef} content={content} onChange={handleContentChange} />
        </div>

        {isSaving && (
          <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-md bg-background/80 px-3 py-1 text-sm backdrop-blur-sm">
            <Loader2 className="h-3 w-3 animate-spin" />
            Saving...
          </div>
        )}
      </div>
    </div>
  )
}
