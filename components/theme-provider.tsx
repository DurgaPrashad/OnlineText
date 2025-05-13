"use client"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

// Add this to tailwind.config.js
// theme: {
//   extend: {
//     colors: {
//       background: "hsl(var(--background))",
//       foreground: "hsl(var(--foreground))",
//       primary: "hsl(var(--primary))",
//       "primary-foreground": "hsl(var(--primary-foreground))",
//       accent: "hsl(var(--accent))",
//       "accent-foreground": "hsl(var(--accent-foreground))",
//     },
//   },
// },
