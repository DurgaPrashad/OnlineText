"use client"

import type React from "react"

import { forwardRef, useImperativeHandle, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface ContentEditableProps {
  html: string
  onChange: (html: string) => void
  placeholder?: string
  className?: string
}

export const ContentEditable = forwardRef<HTMLDivElement, ContentEditableProps>(
  ({ html, onChange, placeholder, className }, ref) => {
    const contentEditableRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => contentEditableRef.current as HTMLDivElement)

    const handleInput = () => {
      if (contentEditableRef.current) {
        onChange(contentEditableRef.current.innerHTML)
      }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault()
      const text = e.clipboardData.getData("text/plain")
      document.execCommand("insertText", false, text)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault()
        document.execCommand("insertHTML", false, "&nbsp;&nbsp;&nbsp;&nbsp;")
      }
    }

    useEffect(() => {
      if (contentEditableRef.current) {
        if (contentEditableRef.current.innerHTML !== html) {
          contentEditableRef.current.innerHTML = html
        }
      }
    }, [html])

    return (
      <div
        ref={contentEditableRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        dangerouslySetInnerHTML={{ __html: html }}
        className={cn(
          "text-lg leading-relaxed",
          !html && "before:content-[attr(data-placeholder)] before:text-muted-foreground before:pointer-events-none",
          className,
        )}
        data-placeholder={placeholder}
      />
    )
  },
)

ContentEditable.displayName = "ContentEditable"
