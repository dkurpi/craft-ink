import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center max-w-4xl mx-auto px-4">
        <div className="flex flex-1 items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="font-bold text-xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              CraftInk
            </div>
          </Link>

          {/* Main Navigation */}
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link 
              href="/generator" 
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Explore
            </Link>
            <Link 
              href="/create" 
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Create
            </Link>
            <Link 
              href="/generator" 
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Community
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
              <Button size="sm">
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </nav>
  );
} 