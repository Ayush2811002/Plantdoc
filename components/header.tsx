import Link from "next/link"
import { Leaf } from "lucide-react"

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span>
              PlantDoc<span className="text-primary">+</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/monitor"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Live Monitor
            </Link>
            <Link
              href="/detection"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Detection
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
