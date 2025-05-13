"use client"

import { Copy, FileText, Menu, MoreHorizontal, Type } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { TextUtilitiesDialog } from "@/components/text-utilities-dialog"
import type { Note } from "@/types/note"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MobileNavbarProps {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
  activeNote: Note | undefined
}

export function MobileNavbar({ isSidebarOpen, onToggleSidebar, activeNote }: MobileNavbarProps) {
  const [isTextUtilitiesOpen, setIsTextUtilitiesOpen] = useState(false)
  const { toast } = useToast()

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

  const handleExport = (format: string) => {
    if (!activeNote) return

    let fileExtension = ""
    let mimeType = ""

    switch (format) {
      case "txt":
        fileExtension = "txt"
        mimeType = "text/plain"
        break
      case "pdf":
        toast({
          title: "PDF Export",
          description: "PDF export would be implemented with a library like jsPDF.",
        })
        return
      case "docx":
        toast({
          title: "DOCX Export",
          description: "DOCX export would be implemented with a library like docx-js.",
        })
        return
      default:
        fileExtension = "txt"
        mimeType = "text/plain"
    }

    const blob = new Blob([activeNote.content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${activeNote.title}.${fileExtension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Export successful",
      description: `Exported as ${activeNote.title}.${fileExtension}`,
    })
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-10 flex items-center justify-between border-t bg-background p-2">
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>

          <Button variant="ghost" size="icon" onClick={() => setIsTextUtilitiesOpen(true)}>
            <Type className="h-5 w-5" />
            <span className="sr-only">Text utilities</span>
          </Button>
        </div>

        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" onClick={handleCopy}>
            <Copy className="h-5 w-5" />
            <span className="sr-only">Copy to clipboard</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <FileText className="h-5 w-5" />
                <span className="sr-only">Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top">
              <DropdownMenuLabel>Export as</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExport("txt")}>Text file (.txt)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("pdf")}>PDF document (.pdf)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("docx")}>Word document (.docx)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top">
              <DropdownMenuItem onClick={() => window.print()}>Print</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  toast({
                    title: "Share feature",
                    description: "Sharing functionality would be implemented here.",
                  })
                }}
              >
                Share note
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <div className="flex items-center justify-between">
                  <span>Theme</span>
                  <ThemeToggle />
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {activeNote && (
        <TextUtilitiesDialog
          open={isTextUtilitiesOpen}
          onOpenChange={setIsTextUtilitiesOpen}
          content={activeNote.content}
          onChange={(newContent) => {
            navigator.clipboard.writeText(newContent)
            toast({
              title: "Text transformed",
              description: "The transformed text has been copied to your clipboard.",
            })
          }}
        />
      )}
    </>
  )
}
