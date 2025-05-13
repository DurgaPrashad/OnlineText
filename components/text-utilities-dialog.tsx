"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

interface TextUtilitiesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  content: string
  onChange: (content: string) => void
}

export function TextUtilitiesDialog({ open, onOpenChange, content, onChange }: TextUtilitiesDialogProps) {
  const [transformedText, setTransformedText] = useState(content)
  const [activeTab, setActiveTab] = useState("case")

  useEffect(() => {
    setTransformedText(content)
  }, [content, open])

  const handleUppercase = () => {
    setTransformedText(content.toUpperCase())
  }

  const handleLowercase = () => {
    setTransformedText(content.toLowerCase())
  }

  const handleTitleCase = () => {
    setTransformedText(
      content
        .split(/\s+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" "),
    )
  }

  const handleRemoveLineBreaks = () => {
    setTransformedText(content.replace(/(\r\n|\n|\r)/gm, " "))
  }

  const handleRemoveExtraSpaces = () => {
    setTransformedText(content.replace(/\s+/g, " ").trim())
  }

  const handleRemoveDuplicateLines = () => {
    const lines = content.split(/\r?\n/)
    const uniqueLines = [...new Set(lines)]
    setTransformedText(uniqueLines.join("\n"))
  }

  const handleApply = () => {
    onChange(transformedText)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Text Utilities</DialogTitle>
          <DialogDescription>Transform your text with these utilities.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="case" value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="case">Case Conversion</TabsTrigger>
            <TabsTrigger value="format">Text Formatting</TabsTrigger>
          </TabsList>

          <TabsContent value="case" className="space-y-4 pt-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={handleUppercase}>
                UPPERCASE
              </Button>
              <Button variant="outline" onClick={handleLowercase}>
                lowercase
              </Button>
              <Button variant="outline" onClick={handleTitleCase}>
                Title Case
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="format" className="space-y-4 pt-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={handleRemoveLineBreaks}>
                Remove Line Breaks
              </Button>
              <Button variant="outline" onClick={handleRemoveExtraSpaces}>
                Remove Extra Spaces
              </Button>
              <Button variant="outline" onClick={handleRemoveDuplicateLines}>
                Remove Duplicate Lines
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4">
          <Textarea
            value={transformedText}
            onChange={(e) => setTransformedText(e.target.value)}
            className="h-[200px]"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
