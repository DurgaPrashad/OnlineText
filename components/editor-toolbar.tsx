"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { Note } from "@/types/note"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  ArrowDownToLine,
  Check,
  Copy,
  FileText,
  FileIcon as FilePdf,
  FileType,
  Menu,
  MoreVertical,
  Type,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TextUtilitiesDialog } from "@/components/text-utilities-dialog"
import { useToast } from "@/hooks/use-toast"

interface EditorToolbarProps {
  note: Note
  content: string
  onToggleSidebar: () => void
  isSidebarOpen: boolean
}

export function EditorToolbar({ note, content, onToggleSidebar, isSidebarOpen }: EditorToolbarProps) {
  const [showCopied, setShowCopied] = useState(false)
  const [isTextUtilitiesOpen, setIsTextUtilitiesOpen] = useState(false)
  const { toast } = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setShowCopied(true)
      setTimeout(() => setShowCopied(false), 2000)
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
    let fileExtension = ""
    let mimeType = ""

    switch (format) {
      case "txt":
        fileExtension = "txt"
        mimeType = "text/plain"
        break
      case "pdf":
        // In a real app, we'd use a library like jsPDF
        toast({
          title: "PDF Export",
          description: "PDF export would be implemented with a library like jsPDF.",
        })
        return
      case "docx":
        // In a real app, we'd use a library like docx
        toast({
          title: "DOCX Export",
          description: "DOCX export would be implemented with a library like docx-js.",
        })
        return
      default:
        fileExtension = "txt"
        mimeType = "text/plain"
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${note.title}.${fileExtension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Export successful",
      description: `Exported as ${note.title}.${fileExtension}`,
    })
  }

  return (
    <TooltipProvider>
      <div className="flex items-center justify-between border-b p-2">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="mr-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          <h2 className="truncate text-lg font-medium">{note.title}</h2>
        </div>

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setIsTextUtilitiesOpen(true)}>
                <Type className="h-5 w-5" />
                <span className="sr-only">Text utilities</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Text utilities</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleCopy}>
                {showCopied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                <span className="sr-only">Copy to clipboard</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{showCopied ? "Copied!" : "Copy to clipboard"}</TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <ArrowDownToLine className="h-5 w-5" />
                    <span className="sr-only">Export</span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Export</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export as</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExport("txt")}>
                <FileText className="mr-2 h-4 w-4" />
                Text file (.txt)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("pdf")}>
                <FilePdf className="mr-2 h-4 w-4" />
                PDF document (.pdf)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("docx")}>
                <FileType className="mr-2 h-4 w-4" />
                Word document (.docx)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
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
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle />
        </div>
      </div>

      <TextUtilitiesDialog
        open={isTextUtilitiesOpen}
        onOpenChange={setIsTextUtilitiesOpen}
        content={content}
        onChange={(newContent) => {
          // In a real app, we'd update the content directly
          navigator.clipboard.writeText(newContent)
          toast({
            title: "Text transformed",
            description: "The transformed text has been copied to your clipboard.",
          })
        }}
      />
    </TooltipProvider>
  )
}
