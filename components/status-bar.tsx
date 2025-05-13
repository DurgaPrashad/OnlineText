interface StatusBarProps {
  wordCount: number
  charCount: number
  lineCount: number
  readingTime: number
}

export function StatusBar({ wordCount, charCount, lineCount, readingTime }: StatusBarProps) {
  return (
    <div className="flex items-center justify-between border-t px-4 py-1 text-xs text-muted-foreground">
      <div className="flex items-center gap-4">
        <div>Words: {wordCount}</div>
        <div>Characters: {charCount}</div>
        <div>Lines: {lineCount}</div>
      </div>
      <div>
        {readingTime === 0 ? "Less than a minute read" : `${readingTime} min${readingTime === 1 ? "" : "s"} read`}
      </div>
    </div>
  )
}
