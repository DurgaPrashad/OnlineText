"use client"

import { useState, useEffect, forwardRef } from "react"
import { ContentEditable } from "@/components/content-editable"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
}

export const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(({ content, onChange }, ref) => {
  const [html, setHtml] = useState("")

  useEffect(() => {
    // Convert plain text to HTML for initial render
    setHtml(content.replace(/\n/g, "<br>") || "")
  }, [content])

  const handleChange = (html: string) => {
    setHtml(html)
    // Convert HTML back to plain text for storage
    const plainText = html.replace(/<br\s*\/?>/g, "\n").replace(/<[^>]*>/g, "")
    onChange(plainText)
  }

  return (
    <ContentEditable
      ref={ref}
      html={html}
      onChange={handleChange}
      placeholder="Start typing your notes here..."
      className="min-h-[calc(100vh-180px)] outline-none"
    />
  )
})

RichTextEditor.displayName = "RichTextEditor"
