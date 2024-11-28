"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn } = useUser();
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center max-w-4xl mx-auto px-4">
        <div className="flex flex-1 items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="text-xl">
              <span className="font-normal">Craft</span><span className="font-bold">Ink</span>
            </div>
          </Link>

          {/* Main Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
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
              href="/docs" 
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Docs
            </Link>
            <Link 
              href="/pricing" 
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Pricing
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {!isSignedIn && (
              <>
                <SignInButton>
                  Log in
                </SignInButton>
                <SignUpButton>
                  Sign Up
                </SignUpButton> 
              </>
            )}
            {isSignedIn && (
              <UserButton />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 