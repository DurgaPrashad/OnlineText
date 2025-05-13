"use client"
import { Button } from "@/components/ui/button"
import { Bold, Italic, Underline, Copy } from "lucide-react"
import type { Note } from "@/types/note"
import { useToast } from "@/hooks/use-toast"

interface BottomToolbarProps {
  activeNote: Note | undefined
}

export function BottomToolbar({ activeNote }: BottomToolbarProps) {
  const { toast } = useToast()

  const handleFormatCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
  }

  const handleCopy = async () => {
    if (!activeNote) return

    try {
      await navigator.clipboard.writeText(activeNote.content)
      toast({
        title: "Copied to clipboard",
        description: "The text has been copied to your clipboard.",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy text to clipboard.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="bg-background py-1 px-2 flex items-center justify-between">
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleFormatCommand("bold")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleFormatCommand("italic")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleFormatCommand("underline")}
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy} title="Copy to clipboard">
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
